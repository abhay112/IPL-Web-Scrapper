let request = require('request');
let cheerio = require('cheerio');
let path = require('path');
let fs = require('fs');
let allMatch = require('./allMatch');
function processSingleMatch(url){
    request(url,cb);
}

// let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-sunrisers-hyderabad-qualifier-2-1237180/full-scorecard";

function cb(error,response,html){
    if(error)
        console.log(error);
    else if(response.statusCode == 404){
        console.log("Page Not Found");
    }else{
        dataExtracter(html);
    }
}
function dataExtracter(html){
    let searchTool = cheerio.load(html);
    console.log("``````````````");
    let pep = './pep';
    if(!fs.existsSync(pep)){
        fs.mkdirSync(pep);
    }
    let bothInningArr = searchTool(".Collapsible");
    
    for(let i = 0; i < bothInningArr.length;i++){
        let teamName = searchTool(bothInningArr[i]).find('h5').text();
        teamName = teamName.split('INNINGS')[0].trim();
        console.log(teamName);
        let teamDir = `./pep/${teamName}`;
        if(!fs.existsSync(teamDir)){
            fs.mkdirSync(teamDir);
        }
        let teamPlayer = searchTool(bothInningArr[i]).find(".table.batsman tbody tr");
        let content = [];
        for(let i = 0; i< teamPlayer.length;i++){
            
            let numberOfTds = searchTool(teamPlayer[i]).find('td');
            if(numberOfTds.length == 8){
                
                let name = searchTool(numberOfTds[0]).text();
                let run = searchTool(numberOfTds[2]).text();
                let ball = searchTool(numberOfTds[3]).text();
                let four = searchTool(numberOfTds[4]).text();
                let six = searchTool(numberOfTds[5]).text();
                let sr = searchTool(numberOfTds[6]).text();
                
                let final = name+"\t"+run+"\t"+ball+"\t"+four+"\t"+six+"\t"+sr+"\n";
                
                // console.log(name);
                if(fs.existsSync(`./pep/${teamName}/${name}.txt`)){
                    fs.appendFileSync(`./pep/${teamName}/${name}.txt`,final);
                }else{
                    let header = "Name"+"\t"+"Run"+"\t"+"ball"+"\t"+"Four"+"\t"+"six"+"\t"+"Strike Rate";
                    fs.writeFileSync(`./pep/${teamName}/${name}.txt`,header);
                    fs.appendFileSync(`./pep/${teamName}/${name}.txt`,final);
                }
                   
            }   
        }
    }

}

module.exports = {
    psm:processSingleMatch
}