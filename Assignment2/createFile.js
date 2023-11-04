var fileSystem = require('fs');
var firstRun = true;
var fileNames = [];
var user_input = process.stdin;
user_input.setEncoding('utf-8');


if(fileSystem.existsSync('./Files/FilesList.txt')) {
    firstRun = false;
}

// console.log("fileNames: ", fileNames)
console.log('Enter Filename : ')

if(!firstRun) {
    readFileNames();
}

function readFileNames() {
    fileSystem.readFile('./Files/FilesList.txt',{encoding: 'utf-8'},(err, content)=> {
        content = JSON.parse(content)
        console.log(content);
        fileNames = [];
        content.forEach(element => {
            fileNames.push(element);
        });
    })
}


user_input.on('data', (data)=> {
    data = data.replace(/(\r\n|\n|\r)/gm,"");
    found = fileNames.includes(data)
    if(found) {
        console.log("Filename exists, Please enter another filename")
    } else {
        fileNames.push(data);
        fileSystem.writeFile(`./Files/${data}`,'You are Awesome',(err, content)=> {
            if(err) throw err;
        })
        fileSystem.writeFile('./Files/FilesList.txt',JSON.stringify(fileNames),(err, content)=> {
            if(err) throw err;
        })
    }
    // console.log("fileNames: ", fileNames)
    console.log('Enter Filename : ')
} 
);
