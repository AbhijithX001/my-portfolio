from config.wsgi import application

# Vercel needs "app" variable in api directory to detect python automatically
app = application
