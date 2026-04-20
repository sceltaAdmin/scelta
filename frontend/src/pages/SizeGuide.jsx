import { useState } from 'react';

const SIZE_DATA = {
  clothing: {
    headers: ['Size', 'Chest (cm)', 'Waist (cm)', 'Hip (cm)', 'Shoulder (cm)', 'Length (cm)'],
    rows: [
      ['XS', '76-80', '60-64', '84-88', '38', '65'],
      ['S',  '81-85', '65-69', '89-93', '40', '67'],
      ['M',  '86-90', '70-74', '94-98', '42', '69'],
      ['L',  '91-96', '75-80', '99-104','44', '71'],
      ['XL', '97-102','81-86', '105-110','46','73'],
      ['XXL','103-108','87-92','111-116','48','75'],
      ['3XL','109-114','93-98','117-122','50','77'],
    ]
  },
  shoes: {
    headers: ['UK Size', 'US Size', 'EU Size', 'Foot Length (cm)', 'Foot Width (cm)'],
    rows: [
      ['5',  '6',   '38', '23.0', '8.5'],
      ['6',  '7',   '39', '24.0', '8.8'],
      ['7',  '8',   '40', '25.0', '9.1'],
      ['8',  '9',   '41', '25.5', '9.3'],
      ['9',  '10',  '42', '26.5', '9.6'],
      ['10', '11',  '43', '27.0', '9.8'],
      ['11', '12',  '44', '28.0', '10.1'],
      ['12', '13',  '45', '28.5', '10.3'],
    ]
  },
  sports: {
    headers: ['Size', 'Height (cm)', 'Weight (kg)', 'Chest (cm)', 'Waist (cm)', 'Recommended For'],
    rows: [
      ['XS', '155-160', '45-55',  '76-80',  '60-64',  'Kids / Petite'],
      ['S',  '160-165', '55-65',  '81-85',  '65-69',  'Slim Build'],
      ['M',  '165-170', '65-75',  '86-90',  '70-74',  'Average Build'],
      ['L',  '170-175', '75-85',  '91-96',  '75-80',  'Athletic Build'],
      ['XL', '175-180', '85-95',  '97-102', '81-86',  'Large Build'],
      ['XXL','180-185', '95-110', '103-108','87-92',  'Extra Large'],
    ]
  }
};

export default function SizeGuide() {
  const [category, setCategory] = useState('clothing');
  const [sortCol, setSortCol]   = useState(0);
  const [sortDir, setSortDir]   = useState('asc');
  const [search, setSearch]     = useState('');
  const [highlight, setHighlight] = useState('');

  const data = SIZE_DATA[category];

  const handleSort = (colIdx) => {
    if (sortCol === colIdx) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(colIdx); setSortDir('asc'); }
  };

  const sortedRows = [...data.rows]
    .filter(row => search === '' || row.some(cell => cell.toString().toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => {
      const aVal = a[sortCol], bVal = b[sortCol];
      const cmp = isNaN(parseFloat(aVal)) ? aVal.localeCompare(bVal) : parseFloat(aVal) - parseFloat(bVal);
      return sortDir === 'asc' ? cmp : -cmp;
    });

  return (
    <main data-testid="size-guide-page" style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--text-1)', marginBottom: 8 }}>Size Guide</h1>
      <p style={{ color: 'var(--text-3)', marginBottom: 32 }}>Find your perfect fit with our comprehensive size charts</p>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {Object.keys(SIZE_DATA).map(cat => (
          <button key={cat} data-testid={`size-cat-${cat}`} onClick={() => { setCategory(cat); setSortCol(0); setSortDir('asc'); setSearch(''); }}
            style={{ padding: '9px 20px', borderRadius: 'var(--r-full)', border: '1.5px solid', borderColor: category === cat ? 'var(--fire)' : 'var(--border)', background: category === cat ? 'var(--fire)' : 'var(--bg-card)', color: category === cat ? '#fff' : 'var(--text-1)', fontWeight: 600, fontSize: 14, cursor: 'pointer', textTransform: 'capitalize' }}>
            {cat === 'clothing' ? '👕 Clothing' : cat === 'shoes' ? '👟 Shoes' : '⚽ Sports'}
          </button>
        ))}
      </div>

      {/* Search + highlight */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input data-testid="size-search" type="text" placeholder="Search size..." value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '9px 16px', borderRadius: 'var(--r-full)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 14, width: 200 }} />
        <input data-testid="size-highlight" type="text" placeholder="Highlight size (e.g. M, L)..." value={highlight}
          onChange={e => setHighlight(e.target.value.toUpperCase())}
          style={{ padding: '9px 16px', borderRadius: 'var(--r-full)', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-1)', fontSize: 14, width: 240 }} />
        {(search || highlight) && (
          <button onClick={() => { setSearch(''); setHighlight(''); }}
            style={{ padding: '9px 16px', borderRadius: 'var(--r-full)', border: '1.5px solid var(--fire)', color: 'var(--fire)', background: 'transparent', fontSize: 14, cursor: 'pointer' }}>
            ✕ Clear
          </button>
        )}
      </div>

      {/* Dynamic sortable table */}
      <div data-testid="size-guide-table" style={{ background: 'var(--bg-card)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-card-2)' }}>
                {data.headers.map((h, i) => (
                  <th key={h} onClick={() => handleSort(i)}
                    data-testid={`size-header-${h.replace(/\s+/g, '-').toLowerCase()}`}
                    style={{ padding: '14px 16px', textAlign: 'left', fontSize: 13, fontWeight: 700, color: 'var(--text-1)', borderBottom: '1px solid var(--border)', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none' }}>
                    {h} {sortCol === i ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedRows.length === 0 ? (
                <tr><td colSpan={data.headers.length} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-3)' }}>No results found</td></tr>
              ) : sortedRows.map((row, ri) => {
                const isHighlighted = highlight && row[0].toString().toUpperCase().includes(highlight);
                return (
                  <tr key={ri} data-testid={`size-row-${row[0]}`}
                    style={{ background: isHighlighted ? 'var(--fire-pale)' : ri % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-card-2)', borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => { if (!isHighlighted) e.currentTarget.style.background = 'var(--snow)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = isHighlighted ? 'var(--fire-pale)' : ri % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-card-2)'; }}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ padding: '13px 16px', fontSize: 14, color: ci === 0 ? 'var(--fire)' : 'var(--text-1)', fontWeight: ci === 0 ? 700 : 400 }}>
                        {cell}
                        {isHighlighted && ci === 0 && <span style={{ marginLeft: 8, fontSize: 10, background: 'var(--fire)', color: '#fff', padding: '2px 6px', borderRadius: 999 }}>Your Size</span>}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', fontSize: 12, color: 'var(--text-3)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Showing {sortedRows.length} of {data.rows.length} sizes</span>
          <span>Click any column header to sort</span>
        </div>
      </div>

      {/* Tooltip info */}
      <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-card-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-2)' }}>
        💡 <strong>Tip:</strong> All measurements are in centimetres. If you're between sizes, we recommend sizing up for a more comfortable fit.
      </div>
    </main>
  );
}
