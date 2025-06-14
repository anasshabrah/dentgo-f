// src/components/chat/ChatInput.tsx

import { useState, useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDropzone } from 'react-dropzone';
import useAutoResizeTextarea from '@/hooks/useAutoResizeTextarea';
import { Paperclip, Image as ImageIcon, X, Send } from 'lucide-react';
import clsx from 'clsx';

interface Props {
  onSubmit: (text: string, images: File[]) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const ref = useAutoResizeTextarea<HTMLTextAreaElement>();

  const dropzone = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acc) => setFiles(acc),
    disabled,
  });

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

  useHotkeys(
    'enter',
    (e) => {
      if (e.shiftKey) return;
      e.preventDefault();
      submit();
    },
    { enableOnFormTags: true, filter: () => ref.current === document.activeElement }
  );

  return (
    <div
      {...dropzone.getRootProps()}
      className={clsx(
        'bg-background border-t border-gray-200 dark:border-gray-700 p-4',
        dropzone.isDragActive && 'ring-2 ring-primary'
      )}
    >
      <div className="flex flex-col gap-2">
        {/* Text Input Box */}
        <div className="relative w-full">
          <textarea
            ref={ref}
            rows={1}
            disabled={disabled}
            placeholder="Send a message or drop an image…"
            className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2 pr-12 shadow-sm text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          {/* Send Button */}
          {(!disabled && (value.trim() || files.length > 0)) && (
            <button
              onClick={submit}
              className="absolute right-2 bottom-2 p-1.5 rounded-lg text-primary hover:bg-primary/10 transition"
              aria-label="Send"
            >
              <Send size={18} />
            </button>
          )}
        </div>

        {/* Image Preview Thumbnails */}
        {files.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {files.map((f, i) => (
              <div key={i} className="relative w-20 h-20 rounded overflow-hidden border border-gray-300 dark:border-gray-700">
                <img
                  src={URL.createObjectURL(f)}
                  alt="upload"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() =>
                    setFiles((arr) => arr.filter((_, idx) => idx !== i))
                  }
                  className="absolute top-0 right-0 bg-black/60 hover:bg-black/80 text-white p-1 rounded-bl"
                  aria-label="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-sm">
          <label className="flex items-center gap-1 cursor-pointer hover:text-primary">
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

          {/* You can enable voice input here later */}
        </div>
      </div>
    </div>
  );
}
