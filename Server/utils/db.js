import mysql from 'mysql'

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "assetms"
})

con.connect((err) => {
    if(!err){
        console.log(" connecting to DB");
    } else {
        console.log(" err Connected to DB"+ `${err}`);

    }
})

export default con;