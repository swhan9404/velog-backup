const { Command } = require('commander');
const fs = require('fs');
const Crawler = require('./crawler');

const program = new Command();

program.version('1.0.2');
program.option('-u, --username <username>', 'velog 유저이름');
program.option('-d, --delay <ms>', '요청 딜레이 시간')
program.option('-c, --cert <access_token>', 'velog 유저 access_token')
program.option('-a, --day <time>', '백업날짜를 폴더명으로' )

program.parse(process.argv);

!fs.existsSync('./backup') && fs.mkdirSync('./backup');
!fs.existsSync('./backup/content') && fs.mkdirSync('./backup/content');
!fs.existsSync('./backup/images') && fs.mkdirSync('./backup/images');
!fs.existsSync(`./backup/${program.day}`) && fs.mkdirSync(`./backup/${program.day}`);
!fs.existsSync(`./backup/${program.day}/content`) && fs.mkdirSync(`./backup/${program.day}/content`);
!fs.existsSync(`./backup/${program.day}/images`) && fs.mkdirSync(`./backup/${program.day}/images`);
!fs.existsSync(`./logs`) && fs.mkdirSync('./logs');

const crawler = new Crawler(program.username, { 
  delay: program.delay || 0,
  cert: program.cert,
  day: program.day
});

console.log('📙 백업을 시작합니다 / velog-backup');
crawler.parse();

