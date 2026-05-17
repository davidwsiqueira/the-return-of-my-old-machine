# Getting Started

This guide will help you get started with your MkDocs documentation site.

## Prerequisites

Before you begin, ensure you have:

- Python 3.8 or higher installed
- pip (Python package manager)
- A text editor or IDE

## Installation

### 1. Clone or Create Your Project

If you're starting fresh:

```bash
mkdir my-docs
cd my-docs
```

### 2. Set Up Virtual Environment

Create and activate a virtual environment:

=== "macOS/Linux"

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

=== "Windows"

    ```bash
    python -m venv venv
    venv\Scripts\activate
    ```

### 3. Install Dependencies

Install MkDocs and Material theme:

```bash
pip install mkdocs mkdocs-material
```

Or use the requirements file:

```bash
pip install -r requirements.txt
```

## Project Structure

Your documentation project has the following structure:

```
.
├── docs/
│   ├── index.md              # Homepage
│   ├── getting-started.md    # This page
│   ├── user-guide.md         # User guide
│   └── reference.md          # Reference docs
├── mkdocs.yml                # Configuration file
├── requirements.txt          # Python dependencies
├── venv/                     # Virtual environment (ignored)
└── site/                     # Built site (ignored)
```

## Development Workflow

### Start Development Server

Run the development server to preview your documentation:

```bash
source venv/bin/activate  # Activate virtual environment
mkdocs serve
```

The site will be available at `http://127.0.0.1:8000`

!!! tip "Live Reload"
    The development server automatically reloads when you save changes to your files.

### Edit Documentation

1. Open any `.md` file in the `docs/` directory
2. Make your changes using Markdown syntax
3. Save the file
4. The browser will automatically refresh

### Add New Pages

To add a new page:

1. Create a new `.md` file in the `docs/` directory
2. Add it to the navigation in `mkdocs.yml`:

```yaml
nav:
  - Home: index.md
  - Getting Started: getting-started.md
  - Your New Page: your-new-page.md
```

## Building the Site

### Build Static Files

Generate the static HTML files:

```bash
mkdocs build
```

The built site will be in the `site/` directory.

### Clean Build

Remove the `site/` directory and rebuild:

```bash
mkdocs build --clean
```

## Deployment

### GitHub Pages

Deploy directly to GitHub Pages:

```bash
mkdocs gh-deploy
```

This command:
1. Builds your documentation
2. Pushes to the `gh-pages` branch
3. Makes it available at `https://username.github.io/repo-name/`

### Other Platforms

You can deploy the `site/` directory to:

- **Netlify**: Drag and drop or connect to Git
- **Vercel**: Connect to your Git repository
- **AWS S3**: Upload the `site/` folder
- **Any static hosting**: Upload the `site/` folder

## Configuration

### Customize Theme

Edit `mkdocs.yml` to customize:

```yaml
theme:
  name: material
  palette:
    primary: indigo  # Change primary color
    accent: pink     # Change accent color
```

Available colors: red, pink, purple, deep purple, indigo, blue, light blue, cyan, teal, green, light green, lime, yellow, amber, orange, deep orange

### Add Features

Enable additional features:

```yaml
theme:
  features:
    - navigation.tabs        # Top-level tabs
    - navigation.sections    # Section navigation
    - navigation.expand      # Expand sections
    - search.suggest         # Search suggestions
    - content.code.copy      # Copy button for code
```

## Next Steps

Now that you're set up, explore:

- **[User Guide](user-guide.md)** - Learn about writing documentation
- **[Reference](reference.md)** - Detailed configuration options
- **[Material Docs](https://squidfunk.github.io/mkdocs-material/)** - Official Material theme documentation

## Troubleshooting

### Virtual Environment Issues

If you have issues with the virtual environment:

```bash
# Deactivate current environment
deactivate

# Remove and recreate
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Port Already in Use

If port 8000 is in use, specify a different port:

```bash
mkdocs serve -a localhost:8001
```

### Build Errors

Check for:
- Syntax errors in `mkdocs.yml`
- Missing files referenced in navigation
- Invalid Markdown syntax

Run with verbose output:

```bash
mkdocs build --verbose