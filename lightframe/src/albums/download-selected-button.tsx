import DownloadIcon from '@mui/icons-material/Download';

interface DownloadSelectedButtonProps {
  selectedCount: number;
  onDownload: () => void;
}

const DownloadSelectedButton = ({ selectedCount, onDownload }: DownloadSelectedButtonProps) => {
  const visible = selectedCount >= 1;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 36,
        left: '50%',
        transform: visible
          ? 'translateX(-50%) translateY(0)'
          : 'translateX(-50%) translateY(calc(100% + 48px))',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.35s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.25s ease',
        zIndex: 1000,
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <button
        onClick={onDownload}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 20px 12px 16px',
          background: '#1c1c1e',
          border: 'none',
          borderRadius: 999,
          cursor: 'pointer',
          color: 'white',
          boxShadow: '0 4px 24px rgba(0,0,0,0.28), 0 1px 4px rgba(0,0,0,0.18)',
          whiteSpace: 'nowrap',
          fontFamily: 'inherit',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.background = '#2c2c2e';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.background = '#1c1c1e';
        }}
      >
        <DownloadIcon style={{ fontSize: 20, color: 'white', flexShrink: 0 }} />

        <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.01em' }}>
          Download Selected
        </span>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 22,
            height: 22,
            padding: '0 6px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.15)',
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1,
            color: 'white',
          }}
        >
          {selectedCount}
        </span>
      </button>
    </div>
  );
};

export default DownloadSelectedButton;
