/**
 * Python Repository Zipper
 * Archives repository including .git folder for TrainPlex Checker Bot
 */

import os
import zipfile

def zip_repository():
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    
    zip_targets = [
        os.path.join(project_root, 'omnicommerce-enterprise.zip'),
        os.path.join(project_root, 'project-1.zip'),
        os.path.join(os.path.dirname(project_root), 'project-1.zip')
    ]
    
    # Exclude node_modules and existing zip files
    exclude_dirs = {'node_modules'}
    exclude_exts = {'.zip'}
    
    print("====================================================")
    print("  Zipping Repository with Python (including .git)...")
    print("====================================================")
    
    for zip_path in zip_targets:
        if os.path.exists(zip_path):
            os.remove(zip_path)
            
        print(f"Creating zip artifact: {zip_path}")
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(project_root):
                # Exclude node_modules from recursion
                dirs[:] = [d for d in dirs if d not in exclude_dirs]
                
                for file in files:
                    if any(file.endswith(ext) for ext in exclude_exts):
                        continue
                    
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, project_root)
                    
                    # Add to zip file preserving relative paths (including .git/...)
                    zipf.write(full_path, rel_path)
                    
        size_mb = os.path.getsize(zip_path) / (1024 * 1024)
        print(f"Generated: {os.path.basename(zip_path)} ({size_mb:.2f} MB)")

if __name__ == '__main__':
    zip_repository()
