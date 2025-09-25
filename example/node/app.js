import Diesel  from '../../dist/main.js'
import { serve } from '../../dist/adaptor/node/main.js'

const app = new Diesel()
app.get("/", (c) => c.text("hello from node diesel/"))

serve(app)