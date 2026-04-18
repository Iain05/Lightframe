import DownloadIcon from '@mui/icons-material/Download';
import CheckIcon from '@mui/icons-material/Check';

export type DownloadStatus = 'idle' | 'fetching' | 'zipping' | 'done';

interface DownloadSelectedButtonProps {
  selectedCount: number;
  status: DownloadStatus;
  fetchProgress: { current: number; total: number };
  onDownload: () => void;
}

const spinnerStyle: React.CSSProperties = {
  width: 18,
  height: 18,
  borderRadius: '50%',
  border: '2px solid rgba(255,255,255,0.25)',
  borderTopColor: 'white',
  flexShrink: 0,
  animation: 'dsb-spin 0.75s linear infinite',
};

const DownloadSelectedButton = ({ selectedCount, status, fetchProgress, onDownload }: DownloadSelectedButtonProps) => {
  const visible = selectedCount >= 1;
  const isLoading = status === 'fetching' || status === 'zipping';
  const isDone = status === 'done';

  const labelContent = () => {
    if (status === 'fetching') return `Fetching ${fetchProgress.current} / ${fetchProgress.total}`;
    if (status === 'zipping') return 'Zipping...';
    if (status === 'done') return 'Done!';
    return 'Download Selected';
  };

  return (
    <>
      <style>{`
        @keyframes dsb-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
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
          onClick={isLoading || isDone ? undefined : onDownload}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 20px 12px 16px',
            background: isDone ? '#1a5c35' : '#1c1c1e',
            border: 'none',
            borderRadius: 999,
            cursor: isLoading || isDone ? 'default' : 'pointer',
            color: 'white',
            boxShadow: '0 4px 24px rgba(0,0,0,0.28), 0 1px 4px rgba(0,0,0,0.18)',
            whiteSpace: 'nowrap',
            fontFamily: 'inherit',
            transition: 'background 0.3s ease',
            minWidth: 200,
            justifyContent: 'center',
          }}
          onMouseEnter={e => {
            if (!isLoading && !isDone)
              (e.currentTarget as HTMLButtonElement).style.background = '#2c2c2e';
          }}
          onMouseLeave={e => {
            if (!isLoading && !isDone)
              (e.currentTarget as HTMLButtonElement).style.background = '#1c1c1e';
          }}
        >
          {isLoading ? (
            <span style={spinnerStyle} />
          ) : isDone ? (
            <CheckIcon style={{ fontSize: 20, color: 'white', flexShrink: 0 }} />
          ) : (
            <DownloadIcon style={{ fontSize: 20, color: 'white', flexShrink: 0 }} />
          )}

          <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '0.01em', transition: 'opacity 0.2s ease' }}>
            {labelContent()}
          </span>

          {status === 'idle' && (
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
          )}
        </button>
      </div>
    </>
  );
};

export default DownloadSelectedButton;
