'use client';
import { useState } from 'react';
import { Category, getAllIds } from '@/lib/categories';
import { ChevronRight } from 'lucide-react';

interface Props {
  nodes: Category[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  depth?: number;
}

function Node({ node, selected, onSelect, depth = 0 }: { node: Category; selected: string | null; onSelect: (id: string | null) => void; depth: number }) {
  const hasChildren = !!node.children?.length;
  const descendantIds = getAllIds(node);
  const isActive = selected ? descendantIds.includes(selected) : false;
  const isSelf = selected === node.id;

  const [open, setOpen] = useState(isActive);

  const handleClick = () => {
    if (isSelf) {
      onSelect(null);
    } else {
      onSelect(node.id);
      if (hasChildren) setOpen(true);
    }
  };

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(o => !o);
  };

  return (
    <div>
      <div
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: `0.4rem 0.75rem 0.4rem ${0.75 + depth * 1}rem`,
          borderRadius: '0.375rem',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: isSelf ? 600 : 400,
          color: isSelf ? 'var(--accent-color)' : isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
          backgroundColor: isSelf ? 'var(--accent-soft)' : 'transparent',
          transition: 'all 0.15s',
          userSelect: 'none',
        }}
        onMouseEnter={e => { if (!isSelf) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--bg-secondary)'; }}
        onMouseLeave={e => { if (!isSelf) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
      >
        {hasChildren ? (
          <span
            onClick={toggleExpand}
            style={{
              display: 'flex',
              alignItems: 'center',
              color: 'var(--text-tertiary)',
              transition: 'transform 0.15s',
              transform: open ? 'rotate(90deg)' : 'none',
              flexShrink: 0,
            }}
          >
            <ChevronRight size={14} />
          </span>
        ) : (
          <span style={{ width: 14, flexShrink: 0 }} />
        )}
        <span style={{ flex: 1 }}>{node.label}</span>
      </div>

      {hasChildren && open && (
        <div>
          {node.children!.map(child => (
            <Node key={child.id} node={child} selected={selected} onSelect={onSelect} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryTree({ nodes, selected, onSelect, depth = 0 }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
      {nodes.map(node => (
        <Node key={node.id} node={node} selected={selected} onSelect={onSelect} depth={depth} />
      ))}
    </div>
  );
}
