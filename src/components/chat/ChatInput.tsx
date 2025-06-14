// src/components/chat/ChatInput.tsx
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDropzone } from 'react-dropzone';
import useAutoResizeTextarea from '@/hooks/useAutoResizeTextarea';
import { Image as ImageIcon, X, Send } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  onSubmit: (text: string, images: File[]) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const ref = useAutoResizeTextarea<HTMLTextAreaElement>();

  const clear = () => {
    setValue('');
    setFiles([]);
    if (ref.current) ref.current.style.height = 'auto';
  };

  const submit = () => {
    if (!value.trim() && files.length === 0) return;
    onSubmit(value, files);
    clear();
  };

  const dropzone = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (accepted) => setFiles(accepted),
    disabled,
  });

  useHotkeys(
    'enter',
    (e) => {
      if (e.shiftKey) return;
      e.preventDefault();
      submit();
    },
    {
      enableOnFormTags: true,
      filter: () => ref.current === document.activeElement,
    }
  );

  return (
    <div
      {...dropzone.getRootProps()}
      className={clsx(
        'bg-background border-t border-gray-200 dark:border-gray-700 px-4 py-3 safe-bottom',
        dropzone.isDragActive && 'ring-2 ring-primary rounded'
      )}
    >
      <div className="flex flex-col gap-3">
        {/* Text input area */}
        <div className="relative">
          <textarea
            ref={ref}
            rows={1}
            disabled={disabled}
            placeholder="Ask about dentistry or upload dental images…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={clsx(
              'w-full resize-none rounded-md border text-sm bg-white dark:bg-gray-900',
              'border-gray-300 dark:border-gray-700 px-4 py-2 pr-11 shadow-sm',
              'text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50'
            )}
          />
          {(!disabled && (value.trim() || files.length > 0)) && (
            <button
              onClick={submit}
              aria-label="Send message"
              className="absolute right-2 bottom-2 text-primary hover:bg-primary/10 rounded-full p-1.5 transition"
            >
              <Send size={18} />
            </button>
          )}
        </div>

        {/* Image Previews */}
        {files.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {files.map((file, i) => (
              <div
                key={i}
                className="relative w-20 h-20 rounded border border-gray-300 dark:border-gray-700 overflow-hidden"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt="Upload preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-0 right-0 bg-black/60 hover:bg-black/80 text-white p-1 rounded-bl"
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <label className="flex items-center gap-1 cursor-pointer hover:text-primary transition">
            <ImageIcon size={16} />
            <span className="hidden sm:inline">Upload</span>
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                if (e.target.files) {
                  setFiles(Array.from(e.target.files));
                }
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
