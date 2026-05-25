import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

interface PropulsionData {
  technology: string;
  speed: string;
  lightSpeedFraction: string;
  travelTime: string;
  status: string;
  speedValue?: number; // для сортировки
  travelTimeYears?: number; // для сортировки
}

const data: PropulsionData[] = [
  {
    technology: 'Walking (5 km/h)',
    speed: '1.4 m/s',
    lightSpeedFraction: '4.7×10⁻⁹c',
    travelTime: '~290 million years',
    status: '😊 Possible',
    speedValue: 1.4,
    travelTimeYears: 290000000,
  },
  {
    technology: 'Car (100 km/h)',
    speed: '27.8 m/s',
    lightSpeedFraction: '9.3×10⁻⁸c',
    travelTime: '~45 million years',
    status: '✅ Real',
    speedValue: 27.8,
    travelTimeYears: 45000000,
  },
  {
    technology: 'Passenger Airplane',
    speed: '900 km/h',
    lightSpeedFraction: '8.3×10⁻⁷c',
    travelTime: '~5 million years',
    status: '✅ Real',
    speedValue: 250,
    travelTimeYears: 5000000,
  },
  {
    technology: 'Bullet (1 km/s)',
    speed: '1 km/s',
    lightSpeedFraction: '0.000003c',
    travelTime: '~1.27 million years',
    status: '✅ Real',
    speedValue: 1000,
    travelTimeYears: 1270000,
  },
  {
    technology: 'Earth Orbital Speed',
    speed: '7.9 km/s',
    lightSpeedFraction: '0.000026c',
    travelTime: '~161,000 years',
    status: '✅ Real',
    speedValue: 7900,
    travelTimeYears: 161000,
  },
  {
    technology: 'Voyager 1',
    speed: '17 km/s',
    lightSpeedFraction: '0.000057c',
    travelTime: '~75,000 years',
    status: '✅ Real',
    speedValue: 17000,
    travelTimeYears: 75000,
  },
  {
    technology: 'New Horizons',
    speed: '16.3 km/s',
    lightSpeedFraction: '0.000054c',
    travelTime: '~78,000 years',
    status: '✅ Real',
    speedValue: 16300,
    travelTimeYears: 78000,
  },
  {
    technology: 'Chemical Rocket (max)',
    speed: '20 km/s',
    lightSpeedFraction: '0.000067c',
    travelTime: '~63,000 years',
    status: '✅ Modern',
    speedValue: 20000,
    travelTimeYears: 63000,
  },
  {
    technology: 'Nuclear Pulse (Project Orion)',
    speed: '100–300 km/s',
    lightSpeedFraction: '~0.001c',
    travelTime: '~4,000–13,000 years',
    status: '🔧 Theoretically Possible',
    speedValue: 200,
    travelTimeYears: 4000,
  },
  {
    technology: 'Ion Drive (future)',
    speed: '300 km/s',
    lightSpeedFraction: '0.001c',
    travelTime: '~4,240 years',
    status: '✅ Real, Slow',
    speedValue: 300000,
    travelTimeYears: 4240,
  },
  {
    technology: 'Solar Sail',
    speed: '500 km/s',
    lightSpeedFraction: '0.0017c',
    travelTime: '~2,500 years',
    status: '🚀 Possible',
    speedValue: 500000,
    travelTimeYears: 2500,
  },
  {
    technology: 'Fusion (Project Daedalus)',
    speed: '36,000 km/s',
    lightSpeedFraction: '0.12c',
    travelTime: '~36 years',
    status: '💭 Concept',
    speedValue: 36000000,
    travelTimeYears: 36,
  },
  {
    technology: 'Antimatter Drive',
    speed: '150,000 km/s',
    lightSpeedFraction: '0.5c',
    travelTime: '~8.5 years*',
    status: '🔮 Theoretical',
    speedValue: 150000000,
    travelTimeYears: 8.5,
  },
  {
    technology: 'Breakthrough Starshot',
    speed: '60,000 km/s',
    lightSpeedFraction: '0.2c',
    travelTime: '~21 years',
    status: '🚧 In Development',
    speedValue: 60000000,
    travelTimeYears: 21,
  },
  {
    technology: 'Relativistic Ship',
    speed: '270,000 km/s',
    lightSpeedFraction: '0.9c',
    travelTime: '~4.7 years (Earth time)',
    status: '🔮 Theoretical',
    speedValue: 270000000,
    travelTimeYears: 4.7,
  },
  {
    technology: 'Speed of Light',
    speed: '299,792 km/s',
    lightSpeedFraction: '1c',
    travelTime: '4.246 years',
    status: '⛔ Impossible for Mass',
    speedValue: 299792000,
    travelTimeYears: 4.246,
  },
  {
    technology: 'Warp Drive (10c)',
    speed: 'FTL',
    lightSpeedFraction: '10c',
    travelTime: '~5 months',
    status: '🫧 Hypothetical',
    speedValue: 2997920000,
    travelTimeYears: 0.416,
  },
  {
    technology: 'Warp Drive (100c)',
    speed: 'FTL',
    lightSpeedFraction: '100c',
    travelTime: '~15 days',
    status: '🫧 Hypothetical',
    speedValue: 29979200000,
    travelTimeYears: 0.041,
  },
  {
    technology: 'Wormhole',
    speed: 'Effective FTL',
    lightSpeedFraction: 'Instant-Hours',
    travelTime: 'Instant-Hours',
    status: '🔬 Pure Theory',
    speedValue: 29979200000,
    travelTimeYears: 0.001,
  },
];

const columnHelper = createColumnHelper<PropulsionData>();

const columns = [
  columnHelper.accessor('technology', {
    header: 'Technology',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('speed', {
    header: 'Speed',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('lightSpeedFraction', {
    header: '% of Light Speed',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('travelTime', {
    header: () => <span>Time to Proxima Centauri<br/><span style={{fontSize: '11px', opacity: 0.7}}>(4.246 light years)</span></span>,
    cell: (info) => {
      const value = info.row.original.travelTimeYears;
      if (value !== undefined) {
        let color = '#666';
        if (value > 1000) color = '#ef4444';
        else if (value > 100) color = '#f59e0b';
        else if (value > 10) color = '#10b981';
        else if (value > 1) color = '#3b82f6';
        else color = '#8b5cf6';
        return <span style={{color, fontWeight: '500'}}>{info.getValue()}</span>;
      }
      return <span>{info.getValue()}</span>;
    },
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: (info) => {
      const status = info.getValue();
      let color = '#666';
      if (status.includes('Real')) color = '#10b981';
      else if (status.includes('Possible')) color = '#3b82f6';
      else if (status.includes('Theoretical') || status.includes('Concept')) color = '#f59e0b';
      else if (status.includes('Hypothetical') || status.includes('Warp')) color = '#8b5cf6';
      else if (status.includes('Impossible') || status.includes('Pure Theory')) color = '#ef4444';
      return <span style={{color, fontSize: '13px'}}>{status}</span>;
    },
  }),
];

export default function PropulsionTable({ style }: { style?: React.CSSProperties }): React.Element {
  const [sorting, setSorting] = React.useState([{ id: 'travelTimeYears', desc: false }]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <div style={style}>
      <div style={{overflowX: 'auto', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
        <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '14px', backgroundColor: 'white'}}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} style={{borderBottom: '2px solid #e5e7eb'}}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      backgroundColor: '#f9fafb',
                      userSelect: 'none',
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    <span style={{marginLeft: '8px', fontSize: '12px', opacity: 0.6}}>
                      {{
                        asc: '↑',
                        desc: '↓',
                      }[header.column.getIsSorted() as string] ?? ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb',
                }}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    style={{
                      padding: '10px 16px',
                      color: '#4b5563',
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{textAlign: 'center', fontSize: '12px', color: '#666', marginTop: '12px'}}>
        <strong>Click column headers to sort</strong> • Data: Proxima Centauri is 4.246 light-years away
      </p>
    </div>
  );
}
