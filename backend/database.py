"""
Simulation Database Manager
Stores simulation metadata and results for scientific workflow.
"""
import sqlite3
import json
import os
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
import threading

@dataclass
class SimulationRecord:
    """Record of a simulation run."""
    id: Optional[int] = None
    timestamp: str = None
    metric_type: str = ""
    params: Dict[str, Any] = None
    statistics: Dict[str, float] = None
    energy_condition: str = ""
    method: str = ""
    grid_size: List[int] = None
    file_path: str = ""  # Path to full data file
    notes: str = ""
    tags: str = ""  # Comma-separated tags
    rating: int = 0  # 1-5 stars for useful results

    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now().isoformat()
        if self.params is None:
            self.params = {}
        if self.statistics is None:
            self.statistics = {}
        if self.grid_size is None:
            self.grid_size = []

class SimulationDatabase:
    """SQLite database for simulation metadata and history."""

    def __init__(self, db_path: str = "simulations.db"):
        self.db_path = db_path
        self.lock = threading.Lock()
        self._init_db()

    def _init_db(self):
        """Initialize database schema."""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS simulations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    metric_type TEXT NOT NULL,
                    params TEXT NOT NULL,
                    statistics TEXT NOT NULL,
                    energy_condition TEXT,
                    method TEXT,
                    grid_size TEXT,
                    file_path TEXT,
                    notes TEXT,
                    tags TEXT,
                    rating INTEGER DEFAULT 0,
                    UNIQUE(timestamp, metric_type, params)
                )
            """)

            # Create indexes for common queries
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_metric_type
                ON simulations(metric_type)
            """)
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_timestamp
                ON simulations(timestamp DESC)
            """)
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_rating
                ON simulations(rating DESC)
            """)

    def save_simulation(self, record: SimulationRecord) -> int:
        """Save a simulation record to the database."""
        with self.lock:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.execute(
                    """
                    INSERT INTO simulations
                    (timestamp, metric_type, params, statistics,
                     energy_condition, method, grid_size, file_path, notes, tags, rating)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        record.timestamp,
                        record.metric_type,
                        json.dumps(record.params),
                        json.dumps(record.statistics),
                        record.energy_condition,
                        record.method,
                        json.dumps(record.grid_size),
                        record.file_path,
                        record.notes,
                        record.tags,
                        record.rating
                    )
                )
                return cursor.lastrowid

    def get_simulation(self, sim_id: int) -> Optional[SimulationRecord]:
        """Get a simulation record by ID."""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute(
                "SELECT * FROM simulations WHERE id = ?",
                (sim_id,)
            )
            row = cursor.fetchone()
            if row:
                return self._row_to_record(row)
            return None

    def get_recent_simulations(
        self,
        limit: int = 50,
        metric_type: Optional[str] = None
    ) -> List[SimulationRecord]:
        """Get recent simulations, optionally filtered by metric type."""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row

            if metric_type:
                cursor = conn.execute(
                    """
                    SELECT * FROM simulations
                    WHERE metric_type = ?
                    ORDER BY timestamp DESC
                    LIMIT ?
                    """,
                    (metric_type, limit)
                )
            else:
                cursor = conn.execute(
                    """
                    SELECT * FROM simulations
                    ORDER BY timestamp DESC
                    LIMIT ?
                    """,
                    (limit,)
                )

            return [self._row_to_record(row) for row in cursor.fetchall()]

    def get_top_rated(self, limit: int = 10) -> List[SimulationRecord]:
        """Get top-rated simulations."""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.execute(
                """
                SELECT * FROM simulations
                WHERE rating > 0
                ORDER BY rating DESC, timestamp DESC
                LIMIT ?
                """,
                (limit,)
            )
            return [self._row_to_record(row) for row in cursor.fetchall()]

    def search_simulations(
        self,
        query: str,
        metric_type: Optional[str] = None
    ) -> List[SimulationRecord]:
        """Search simulations by tags, notes, or params."""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row

            sql = """
                SELECT * FROM simulations
                WHERE (tags LIKE ? OR notes LIKE ? OR params LIKE ?)
            """
            params = [f"%{query}%", f"%{query}%", f"%{query}%"]

            if metric_type:
                sql += " AND metric_type = ?"
                params.append(metric_type)

            sql += " ORDER BY timestamp DESC"

            cursor = conn.execute(sql, params)
            return [self._row_to_record(row) for row in cursor.fetchall()]

    def update_simulation(
        self,
        sim_id: int,
        notes: Optional[str] = None,
        tags: Optional[str] = None,
        rating: Optional[int] = None
    ) -> bool:
        """Update simulation metadata."""
        updates = []
        params = []

        if notes is not None:
            updates.append("notes = ?")
            params.append(notes)
        if tags is not None:
            updates.append("tags = ?")
            params.append(tags)
        if rating is not None:
            updates.append("rating = ?")
            params.append(rating)

        if not updates:
            return False

        params.append(sim_id)

        with self.lock:
            with sqlite3.connect(self.db_path) as conn:
                conn.execute(
                    f"UPDATE simulations SET {', '.join(updates)} WHERE id = ?",
                    params
                )
                return True

    def delete_simulation(self, sim_id: int) -> bool:
        """Delete a simulation record."""
        with self.lock:
            with sqlite3.connect(self.db_path) as conn:
                # Get file path first
                record = self.get_simulation(sim_id)
                if record and record.file_path:
                    # Delete data file
                    if os.path.exists(record.file_path):
                        try:
                            os.remove(record.file_path)
                        except Exception as e:
                            print(f"Warning: Could not delete file {record.file_path}: {e}")

                # Delete database record
                conn.execute("DELETE FROM simulations WHERE id = ?", (sim_id,))
                return True

    def get_statistics(self) -> Dict[str, Any]:
        """Get database statistics."""
        with sqlite3.connect(self.db_path) as conn:
            # Total simulations
            total = conn.execute(
                "SELECT COUNT(*) FROM simulations"
            ).fetchone()[0]

            # By metric type
            by_metric = conn.execute(
                """
                SELECT metric_type, COUNT(*) as count
                FROM simulations
                GROUP BY metric_type
                ORDER BY count DESC
                """
            ).fetchall()

            # By method
            by_method = conn.execute(
                """
                SELECT method, COUNT(*) as count
                FROM simulations
                GROUP BY method
                ORDER BY count DESC
                """
            ).fetchall()

            return {
                "total_simulations": total,
                "by_metric_type": dict(by_metric),
                "by_method": dict(by_method),
                "top_rated_count": conn.execute(
                    "SELECT COUNT(*) FROM simulations WHERE rating > 0"
                ).fetchone()[0]
            }

    def _row_to_record(self, row: sqlite3.Row) -> SimulationRecord:
        """Convert database row to SimulationRecord."""
        return SimulationRecord(
            id=row["id"],
            timestamp=row["timestamp"],
            metric_type=row["metric_type"],
            params=json.loads(row["params"]),
            statistics=json.loads(row["statistics"]),
            energy_condition=row["energy_condition"],
            method=row["method"],
            grid_size=json.loads(row["grid_size"]),
            file_path=row["file_path"],
            notes=row["notes"],
            tags=row["tags"],
            rating=row["rating"]
        )

# Global database instance
_db_instance = None

def get_database(db_path: str = "simulations.db") -> SimulationDatabase:
    """Get global database instance."""
    global _db_instance
    if _db_instance is None:
        _db_instance = SimulationDatabase(db_path)
    return _db_instance

if __name__ == "__main__":
    # Test database
    db = SimulationDatabase("test_simulations.db")

    # Create test record
    record = SimulationRecord(
        metric_type="alcubierre",
        params={"velocity": 1.5, "radius": 6.0},
        statistics={"min": -1.2, "max": 0.0},
        energy_condition="Negative",
        method="finite_diff",
        grid_size=[1, 64, 64, 64],
        tags="test,example"
    )

    sim_id = db.save_simulation(record)
    print(f"Saved simulation with ID: {sim_id}")

    # Retrieve
    retrieved = db.get_simulation(sim_id)
    print(f"Retrieved: {retrieved}")

    # Statistics
    stats = db.get_statistics()
    print(f"Database stats: {stats}")

    # Cleanup
    os.remove("test_simulations.db")
