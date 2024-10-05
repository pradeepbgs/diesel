class ResponseHandler {
    constructor(){
        this.response = null;
    }

    text(message, status = 200) {
       this.response= new Response(message, { status });
    }

    json(data, status = 200) {
        this.response = new Response(JSON.stringify(data), {
            status,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    file(filePath) {
        this.response = new Response(file(filePath));
    }

    redirect(location, status = 302) {
        this.response = Response.redirect(location, status);
    }
}

export default ResponseHandler