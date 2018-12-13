
// VIEW

let $message = document.getElementById('messages');

function scrollDown () {
  $message.scrollTop = $message.height;
}

function notify (msg) {
  let $element = document.createElement('div');
  $element.innerText = msg;
  $element.classList.add('notification')
  
  $message.appendChild($element);
  scrollDown();
}

function printUserMessage (text) {
  let $element = document.createElement('div');
  $element.innerText = text;
  $element.classList.add('user-message');

  $message.appendChild($element);
  scrollDown();
}

function printChannelMessage (text) {
  let $element = document.createElement('div');
  $element.innerText = text;
  $element.classList.add('channel-message');

  $message.appendChild($element);
  scrollDown();
}

const $form = document.getElementById('form-input');
const $input = document.querySelector('#form-input input');
$form.addEventListener("submit", (event) => {
  event.preventDefault();
  printUserMessage($input.value);
  $input.value = '';
  generalChannel.sendMessage($input.value);
});


// MODEL
let chatClient;
let username;
let generalChannel;

axios.post('/token', { deviceId: 'browser', identity: 'testinho7' })
  .then(res => {
    username = res.data.identity;
    return Twilio.Chat.Client.create(res.data.token)
  })
  .then(client => {
    notify(`Você é o usuário ${username}`);
    chatClient = client;
    chatClient.getSubscribedChannels().then(joinGeneralChannel);
  })
  .catch(handleErr);

function joinGeneralChannel () {
  chatClient.getChannelByUniqueName('general')
  .then(channel => {
    generalChannel = channel;
    joinChannel();
  })
  .catch(handleErr)
}

function joinChannel() {
  generalChannel.join()
    .then(channel => notify(`Joined in General channel as ${username}`))
    .catch(handleErr);

  generalChannel.on('messageAdded', function(message) {
    printChannelMessage(`${message.author}, ${message.body}`);
  });
}

function handleErr (err) { console.log(err) }