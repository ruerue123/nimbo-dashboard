import React, { useMemo } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { FaPlus } from 'react-icons/fa';

// Optional product variants. Sellers who don't need them can leave the
// section empty (or untoggle "Use variants") and the product behaves like
// a single-stock listing. When variants are on, each (size × color) combo
// holds its own stock count and the parent stock is the sum.
//
// Props:
//   value: { hasVariants, sizes: string[], colors: {name,hex}[], variants: {size,color,stock}[], stock: number }
//   onChange: (next) => void
const SIZE_PRESETS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const VariantsEditor = ({ value, onChange }) => {
    const { hasVariants, sizes, colors, variants, stock } = value;

    const setField = (patch) => onChange({ ...value, ...patch });

    const toggleVariants = () => {
        const next = !hasVariants;
        if (next) {
            // Switching on with no sizes/colors yet — start empty; combos will
            // appear once the seller adds at least one size or color.
            setField({ hasVariants: true });
        } else {
            // Switching off clears variant state but keeps the seller's stock
            // number editable.
            setField({ hasVariants: false, sizes: [], colors: [], variants: [] });
        }
    };

    const addSize = (size) => {
        const trimmed = size.trim();
        if (!trimmed) return;
        if (sizes.includes(trimmed)) return;
        setField({
            sizes: [...sizes, trimmed],
            variants: rebuildVariants([...sizes, trimmed], colors, variants)
        });
    };

    const removeSize = (size) => {
        const nextSizes = sizes.filter(s => s !== size);
        setField({
            sizes: nextSizes,
            variants: rebuildVariants(nextSizes, colors, variants)
        });
    };

    const addColor = (name, hex) => {
        const trimmedName = (name || '').trim();
        if (!trimmedName && !hex) return;
        if (colors.some(c => c.name.toLowerCase() === trimmedName.toLowerCase() && c.hex === hex)) return;
        const nextColors = [...colors, { name: trimmedName, hex: hex || '' }];
        setField({
            colors: nextColors,
            variants: rebuildVariants(sizes, nextColors, variants)
        });
    };

    const removeColor = (idx) => {
        const nextColors = colors.filter((_, i) => i !== idx);
        setField({
            colors: nextColors,
            variants: rebuildVariants(sizes, nextColors, variants)
        });
    };

    const setVariantStock = (size, color, newStock) => {
        const parsed = Math.max(0, parseInt(newStock, 10) || 0);
        const exists = variants.some(v => v.size === size && v.color === color);
        const next = exists
            ? variants.map(v => v.size === size && v.color === color ? { ...v, stock: parsed } : v)
            : [...variants, { size, color, stock: parsed }];
        setField({ variants: next });
    };

    const totalStock = useMemo(
        () => variants.reduce((sum, v) => sum + (v.stock || 0), 0),
        [variants]
    );

    // The grid rows. If the seller adds only sizes (no colors) we still show
    // one row per size with color = ''. Same for colors-only.
    const grid = buildGridRows(sizes, colors);

    return (
        <div className='border border-gray-200 rounded-xl p-5 bg-gray-50/50'>
            <div className='flex items-start justify-between gap-4 mb-4'>
                <div>
                    <h3 className='text-base font-semibold text-gray-800'>Sizes & colors (optional)</h3>
                    <p className='text-sm text-gray-500'>Turn on if your product comes in multiple sizes or colors. Stock is tracked per combination.</p>
                </div>
                <label className='inline-flex items-center cursor-pointer shrink-0'>
                    <input
                        type='checkbox'
                        checked={hasVariants}
                        onChange={toggleVariants}
                        className='sr-only peer'
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-checked:bg-cyan-500 rounded-full relative transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-5"></div>
                </label>
            </div>

            {hasVariants && (
                <div className='space-y-5'>
                    {/* Sizes */}
                    <SizesSection sizes={sizes} onAdd={addSize} onRemove={removeSize} />

                    {/* Colors */}
                    <ColorsSection colors={colors} onAdd={addColor} onRemove={removeColor} />

                    {/* Stock grid */}
                    {grid.length > 0 ? (
                        <div>
                            <div className='flex items-center justify-between mb-2'>
                                <label className='block text-sm font-medium text-gray-700'>Stock per combination</label>
                                <span className='text-sm text-gray-500'>Total: <span className='font-semibold text-gray-700'>{totalStock}</span></span>
                            </div>
                            <div className='bg-white border border-gray-200 rounded-xl overflow-hidden'>
                                <div className='grid grid-cols-[1fr_1fr_120px] text-xs uppercase tracking-wide text-gray-500 bg-gray-50 border-b border-gray-200'>
                                    <div className='px-4 py-2'>Size</div>
                                    <div className='px-4 py-2'>Color</div>
                                    <div className='px-4 py-2 text-right'>Stock</div>
                                </div>
                                {grid.map(({ size, color }, i) => {
                                    const variant = variants.find(v => v.size === size && v.color === color);
                                    return (
                                        <div key={`${size}|${color}|${i}`} className='grid grid-cols-[1fr_1fr_120px] items-center border-b border-gray-100 last:border-b-0'>
                                            <div className='px-4 py-2 text-gray-700'>{size || <span className='text-gray-400'>—</span>}</div>
                                            <div className='px-4 py-2 text-gray-700 flex items-center gap-2'>
                                                {color ? (
                                                    <>
                                                        {(() => {
                                                            const c = colors.find(c => c.name === color);
                                                            return c?.hex ? <span className='inline-block w-4 h-4 rounded-full border border-gray-300' style={{ background: c.hex }} /> : null;
                                                        })()}
                                                        <span>{color}</span>
                                                    </>
                                                ) : <span className='text-gray-400'>—</span>}
                                            </div>
                                            <div className='px-2 py-2'>
                                                <input
                                                    type='number'
                                                    min='0'
                                                    value={variant?.stock ?? 0}
                                                    onChange={(e) => setVariantStock(size, color, e.target.value)}
                                                    className='w-full px-3 py-2 text-right border border-gray-200 rounded-lg focus:border-cyan-500 outline-none text-sm'
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <p className='text-sm text-gray-500 italic'>Add at least one size or color to start tracking stock.</p>
                    )}
                </div>
            )}

            {!hasVariants && (
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Stock Quantity <span className='text-red-500'>*</span></label>
                    <input
                        type='number'
                        min='0'
                        value={stock}
                        onChange={(e) => setField({ stock: e.target.value })}
                        className='w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all'
                        placeholder='Enter stock quantity'
                    />
                </div>
            )}
        </div>
    );
};

// When sizes/colors change, drop variant entries that no longer match a valid
// combo. We don't preemptively create rows for new combos — the grid renders
// rows from sizes×colors and reads stock from variants, defaulting to 0.
const rebuildVariants = (sizes, colors, prev) => {
    const validKeys = new Set();
    if (sizes.length > 0 && colors.length > 0) {
        for (const s of sizes) for (const c of colors) validKeys.add(`${s}|${c.name}`);
    } else if (sizes.length > 0) {
        for (const s of sizes) validKeys.add(`${s}|`);
    } else if (colors.length > 0) {
        for (const c of colors) validKeys.add(`|${c.name}`);
    }
    return prev.filter(v => validKeys.has(`${v.size}|${v.color}`));
};

const buildGridRows = (sizes, colors) => {
    if (sizes.length > 0 && colors.length > 0) {
        const out = [];
        for (const s of sizes) for (const c of colors) out.push({ size: s, color: c.name });
        return out;
    }
    if (sizes.length > 0) return sizes.map(s => ({ size: s, color: '' }));
    if (colors.length > 0) return colors.map(c => ({ size: '', color: c.name }));
    return [];
};

const SizesSection = ({ sizes, onAdd, onRemove }) => {
    const [custom, setCustom] = React.useState('');
    return (
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Sizes</label>
            <div className='flex flex-wrap gap-2 mb-3'>
                {SIZE_PRESETS.map(p => {
                    const active = sizes.includes(p);
                    return (
                        <button
                            key={p}
                            type='button'
                            onClick={() => active ? onRemove(p) : onAdd(p)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${active ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-cyan-400'}`}
                        >
                            {p}
                        </button>
                    );
                })}
            </div>
            {sizes.filter(s => !SIZE_PRESETS.includes(s)).length > 0 && (
                <div className='flex flex-wrap gap-2 mb-3'>
                    {sizes.filter(s => !SIZE_PRESETS.includes(s)).map(s => (
                        <span key={s} className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-cyan-500 text-white'>
                            {s}
                            <button type='button' onClick={() => onRemove(s)} className='hover:bg-white/20 rounded-full'>
                                <IoMdCloseCircle />
                            </button>
                        </span>
                    ))}
                </div>
            )}
            <div className='flex gap-2'>
                <input
                    type='text'
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            onAdd(custom);
                            setCustom('');
                        }
                    }}
                    placeholder='Custom size (e.g. 10, 32W, EU 42)'
                    className='flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 outline-none text-sm'
                />
                <button
                    type='button'
                    onClick={() => { onAdd(custom); setCustom(''); }}
                    className='px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium inline-flex items-center gap-1'
                >
                    <FaPlus className='text-xs' /> Add
                </button>
            </div>
        </div>
    );
};

const ColorsSection = ({ colors, onAdd, onRemove }) => {
    const [name, setName] = React.useState('');
    const [hex, setHex] = React.useState('#000000');

    const submit = () => {
        if (!name.trim()) return;
        onAdd(name, hex);
        setName('');
        setHex('#000000');
    };

    return (
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Colors</label>
            {colors.length > 0 && (
                <div className='flex flex-wrap gap-2 mb-3'>
                    {colors.map((c, i) => (
                        <span key={i} className='inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-gray-200'>
                            <span className='inline-block w-4 h-4 rounded-full border border-gray-300' style={{ background: c.hex || 'transparent' }} />
                            <span className='text-gray-700'>{c.name || c.hex}</span>
                            <button type='button' onClick={() => onRemove(i)} className='text-gray-400 hover:text-red-500'>
                                <IoMdCloseCircle />
                            </button>
                        </span>
                    ))}
                </div>
            )}
            <div className='flex gap-2 items-center'>
                <input
                    type='color'
                    value={hex}
                    onChange={(e) => setHex(e.target.value)}
                    className='h-10 w-12 border border-gray-200 rounded-lg cursor-pointer'
                />
                <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            submit();
                        }
                    }}
                    placeholder='Color name (e.g. Navy Blue)'
                    className='flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:border-cyan-500 outline-none text-sm'
                />
                <button
                    type='button'
                    onClick={submit}
                    className='px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium inline-flex items-center gap-1'
                >
                    <FaPlus className='text-xs' /> Add
                </button>
            </div>
        </div>
    );
};

export default VariantsEditor;
