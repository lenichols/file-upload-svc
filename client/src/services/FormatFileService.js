
import axios from "axios"

export default {

    async parseToJson(data) {
        var lines = data.split("\n");
        var result = [];
        var headers=lines[0].split(",");

        let columns = [
            { field: 'code', header: 'Code' },
            { field: 'name', header: 'Name' },
            { field: 'category', header: 'Category' },
            { field: 'quantity', header: 'Quantity' }
        ];

        let passedHeaders = []
        let rawobj = {}
        

        for(var i=1;i<lines.length;i++){
            let obj = new Object();
            let currentline=lines[i].split(",");
            for(var j=0;j<headers.length;j++){
                obj[headers[j]] = currentline[j]
                passedHeaders.push(headers[j])
            }
            rawobj = obj;
            result.push(obj);
        }  

            let newobj = rawobj
            let keysfound = []            

            Object.keys(newobj).forEach(key => {
                let cleanedkey = key.replace(/['"]+/g, '')
                keysfound.push(cleanedkey)
            })
            console.log("keysfound", keysfound);
            
        //return result; //JavaScript object
        return { "res": JSON.stringify(result), "keys": keysfound }
    },
    async postHandleFile() {
        let res = await axios.post("http://localhost:5001/services/handlefile/");
        return res.data;
    }

}
