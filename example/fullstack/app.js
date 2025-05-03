
import homepage from './templates/index.html'
import aboutPage from './templates/about.html'


Bun.serve({
    static:{
        "/":homepage
    }
 
})

