from fastapi import FastAPI
from api.oncall   import app as oncall_app     # your existing file
from api.postcall import app as postcall_app   # your existing file

app = FastAPI()
app.mount("/oncall",  oncall_app)
app.mount("/postcall", postcall_app)
