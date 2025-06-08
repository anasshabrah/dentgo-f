import os

# List of files to collect (relative to project root)
files_to_collect = [
    "package.json",
    "index.html",
    "tsconfig.json",
    "vercel.json",
    "vite.config.ts",
    os.path.join("src", "config.ts"),
    os.path.join("src", "index.tsx"),
]

# Output file
output_file = "collected_files.txt"

def collect_files(file_list, output_path):
    with open(output_path, "w", encoding="utf-8") as outfile:
        for file_path in file_list:
            if os.path.exists(file_path):
                with open(file_path, "r", encoding="utf-8") as infile:
                    content = infile.read()
                    outfile.write(f"=== {file_path} ===\n")
                    outfile.write(content)
                    outfile.write("\n\n")
                print(f"✅ Collected: {file_path}")
            else:
                print(f"⚠️ Skipped (not found): {file_path}")

    print(f"\n🎉 All done! Collected content saved to '{output_path}'.")

if __name__ == "__main__":
    collect_files(files_to_collect, output_file)
