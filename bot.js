const botconfig = require("./botconfig");
const Secret = require("./token");
const Discord = require("discord.js");
const fs = require("fs");
let xp = require('./XP.json');
const prefix = botconfig.prefix;
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();
let silver = botconfig.silver;


fs.readdir("./commands", (err, files) => {
  if(err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("couldn't find Commands.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online!`);
  bot.user.setActivity(".help", {type: "PLAYING"})
});

bot.on("guildMemberAdd", async member => {
  console.log(`${member.id} joined the server.`);

  let welcomechannel = member.guild.channels.find(`name`, "welcome");
  let message = [`LOOK OUT EVERYONE! ${member} has joined the party!`,`${member} hopped into the server`,
  `Pay your respect for ${member} has joined`, `${member} has sneaked into the server`,
`brace yourself!! ${member} Slipped into the server`]

  let result = (Math.floor((Math.random() * message.length)));

  let addembed = new Discord.RichEmbed()
  .setImage("https://orig00.deviantart.net/aa1b/f/2009/234/f/e/welcome_sign_by_lemongel.jpg")

  welcomechannel.send(message[result])
  welcomechannel.send(addembed);
});

bot.on("guildMemberRemove", async member => {
  console.log(`${member.id} left the server.`);

  let welcomechannel = member.guild.channels.find(`name`, "welcome");
  let message = [`Another One Bites To Dust! ${member}`, `Thanks For being in the journey ${member}`]

  let result = (Math.floor((Math.random() * message.length)));

  let Removeembed = new Discord.RichEmbed()
  .setThumbnail("https://i.pinimg.com/564x/3f/5d/1d/3f5d1de23defbeabc3d5add03d0a768c.jpg")

  welcomechannel.send(Removeembed);
  welcomechannel.send(message[result])
});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let xpAdd = Math.floor(Math.random() * 4) + 7;
  console.log(xpAdd);

  if(!xp[message.author.id]){
    xp[message.author.id] = {
      xp: 0,
      level: 1
    };
  }


  let curxp = xp[message.author.id].xp;
  let curlvl = xp[message.author.id].level;
  let nxtLvl = xp[message.author.id].level * 500;
  xp[message.author.id].xp = curxp + xpAdd;
  if(nxtLvl <= xp[message.author.id].xp){
  xp[message.author.id].level = curlvl + 1;
  let lvlup = new Discord.RichEmbed()
  .setTitle("Level up!")
  .setColor("0000ff")
  .addField("New levl", curlvl + 1);

  message.channel.send(lvlup).then(msg => {msg.delete(5000)});
  }
  fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
  if(err) console.log(err)
  });

  let messageArray = message.content.split(" ");
  let command = messageArray[0];
  let args = messageArray.slice(1);

  if(!command.startsWith(prefix)) return;

  let cmd = bot.commands.get(command.slice(prefix.length));
  if(cmd) cmd.run(bot, message, args);

});

  bot.login(process.env.BOT_TOKEN);
