import DataUriParser from "datauri/parser.js"
import Path from "path";

const getDataUri = (file)=>{
    const extName= Path.extname(file.originalname).toString()
     const parser= new DataUriParser();
     return parser.format(extName,file.buffer)
}

export default getDataUri