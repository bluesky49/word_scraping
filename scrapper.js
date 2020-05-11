
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs')
const path = require('path')
const os = require('os');

const filename = path.join(__dirname, 'output.csv')

const url = 'https://www.easytrans.org/en/norwegian-verbs/';
var urls = []

const dutch = [["Norwegian","Dutch"].join()]
const french = [["Norwegian","French"].join()]
const portuguese = [["Norwegian","Portuguese"].join()]
const english = [["Norwegian","English"].join()]
const swedish = [["Norwegian","Swedish"].join()]
const german = [["Norwegian","German"].join()]
const italian = [["Norwegian","Italian"].join()]
const spanish = [["Norwegian","Spanish"].join()]

characters_url_getting = async () => {
  await axios(url)
    .then(async response => {
      const html = response.data;
      const $ = cheerio.load(html)
      const group = $(".btn-group").eq(0)
      group.find('.btn > a').each(function(i, elem) {
        urls.push('https://www.easytrans.org/en/norwegian-verbs/' + elem.attribs['href'])          
      })

        for (var i=0; i<urls.length; i++){
          var item = urls[i]
          console.log(item, "+++++++++++++++++")
          await axios(item)
            .then(async res => {
              console.log(item,"-----------------")
              const html = res.data;
              const $ = cheerio.load(html)
              $(".tab-pane").each(function(i, ele){
                title = $(this).find("div > b").text()
                $(this).find("table>tbody>tr").each(function(i,ele){
                  const row = []
                  var origin = $(this).find("td>a").text().trim()
                  var str1 = ""
                  for (var index=0; index<origin.length-1; index++){
                    if (origin[index] != " ") str1 += origin[index]
                    else {
                      if (origin[index+1] != " ") str1 += origin[index]
                      else continue
                    }
                  }
                  str1 += origin[origin.length-1]
                  row.push(`"${str1}"`)
                  str1 = ""
                  var trans = $(this).find("td>p").text().trim()
                  for (var index=0; index<trans.length-1; index++){
                    if (trans[index] != " ") str1 += trans[index]
                    else {
                      if (trans[index+1] != " ") str1 += trans[index]
                      else continue
                    }
                  }
                  str1 += trans[trans.length-1]
                  row.push(`"${str1}"`)
                  debugger
                  switch (title) {
                    case "Dutch":
                      dutch.push(row.join())
                      break
                    case "English":
                      english.push(row.join())
                      break
                    case "French":
                      french.push(row.join())
                      break
                    case "German":
                      german.push(row.join())
                      break
                    case "Italian":
                      italian.push(row.join())
                      break
                    case "Portuguese":
                      portuguese.push(row.join())
                      break
                    case "Spanish":
                      spanish.push(row.join())
                      break
                    case "Swedish":
                      swedish.push(row.join())
                      break
                  }
                });
              })
            })
        }
        

      var fn = ['English','French','Italian','Swedish','Spanish','Dutch', 'German','Portuguese']
      for (var i = 0; i < fn.length; i++){
        var filename = path.join(__dirname, "Norwegian-"+ fn[i] +'.csv')
        console.log(filename)
        if (fn[i] =="English") {fs.writeFileSync(filename,english.join(os.EOL),{encoding:"ascii"})}
        if (fn[i] =="French") {fs.writeFileSync(filename,french.join(os.EOL),{encoding:"ascii"})}
        if (fn[i] =="Italian") {fs.writeFileSync(filename,italian.join(os.EOL),{encoding:"ascii"})}
        if (fn[i] =="Swedish") {fs.writeFileSync(filename,swedish.join(os.EOL),{encoding:"ascii"})}
        if (fn[i] =="Spanish") {fs.writeFileSync(filename,spanish.join(os.EOL),{encoding:"ascii"})}
        if (fn[i] =="Dutch") {fs.writeFileSync(filename,dutch.join(os.EOL),{encoding:"ascii"})}
        if (fn[i] =="Portuguese") {fs.writeFileSync(filename,portuguese.join(os.EOL),{encoding:"ascii"})}
        if (fn[i] =="German") {fs.writeFileSync(filename,german.join(os.EOL),{encoding:"ascii"})}
      }
    })
    .catch(console.error);
}

characters_url_getting()