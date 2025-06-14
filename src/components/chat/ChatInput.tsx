// src/components/chat/ChatInput.tsx

import { useState, useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDropzone } from 'react-dropzone';
import useAutoResizeTextarea from '@/hooks/useAutoResizeTextarea';
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

  // Enter vs Shift+Enter
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
        'bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-3',
        dropzone.isDragActive && 'ring-2 ring-primary'
      )}
    >
      <textarea
        ref={ref}
        placeholder="Type a message or upload an image…"
        className="w-full resize-none bg-transparent outline-none text-sm leading-6"
        rows={1}
        disabled={disabled}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {/* thumbnails */}
      {files.length > 0 && (
        <div className="flex gap-2 mt-2">
          {files.map((f, i) => (
            <div key={i} className="relative">
              <img
                src={URL.createObjectURL(f)}
                alt=""
                className="w-16 h-16 object-cover rounded"
              />
              <button
                onClick={() =>
                  setFiles((arr) => arr.filter((_, idx) => idx !== i))
                }
                className="absolute -top-1 -right-1 bg-black/60 text-white rounded-full w-5 h-5"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* action row */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-3 text-gray-500">
          <label className="cursor-pointer hover:text-primary">
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
            🖼️
          </label>

          {/* (Optional) voice input */}
          {/* <VoiceButton onTranscribed={(t) => setValue(v => v + t)} /> */}
        </div>

        {(!disabled && (value.trim() || files.length > 0)) && (
          <button
            onClick={submit}
            className="px-4 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
}
