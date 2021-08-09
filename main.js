let request = require('request');
let cheerio = require('cheerio');
let path = require('path');
let fs = require('fs');
let allMatch = require('./allMatch');
let scoreCArdObj = require('./scoreCard')

// let folderPath  = path.join(__dirname,ipl);
// dirCreater(folderPath);

let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";

request(url,cb);

function cb(error,response,html){
    if(error)
        return console.log('Url not found');
    extractAllMatches(html);
}
function extractAllMatches(html){
    const searchTool = cheerio.load(html);
    let anchorrep= searchTool('a[data-hover="View All Results"]');
    let link = anchorrep.attr("href");
    link = "https://www.espncricinfo.com"+link;
    console.log(link);
    let fullAllMatchPageLink = link;
    // go to all match page

    request(fullAllMatchPageLink,allMatchPageCb);
}
function allMatchPageCb(error,response,html){
    if(error)
        return console.log('Url not found');
    else if(response.statusCode == 404){
        console.log("Page Note Found");
    }else{
        getAllScoreCardLink(html);
    }

}
function getAllScoreCardLink(html){
    let searchTool = cheerio.load(html);
    let matchLnk = searchTool(".match-info.match-info-FIXTURES")
    console.log(matchLnk.length);
    let linkOfMatches = [];

    for(let i = 0;i<matchLnk.length;i++){
        let d = searchTool(matchLnk[i]);
        
        let aElem = searchTool(matchLnk[i]).find("a");
        let link = aElem.attr("href");
        
        let fulMatchLink = `https://www.espncricinfo.com${link}`;
        scoreCArdObj.psm(fulMatchLink);
    }
}
