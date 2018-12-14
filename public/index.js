
// VIEW

let $message = document.getElementById('messages');
const $form = document.getElementById('form-input');
const $input = document.querySelector('#form-input input');

notify('Conectando ao servidor...')

function scrollDown () {
  $message.scrollTop = $message.getBoundingClientRect().height;
}

function notify (msg) {
  let $element = document.createElement('div');
  $element.innerText = msg;
  $element.classList.add('notification')
  
  $message.appendChild($element);
  scrollDown();
}

function printMessage (from, message) {
  let $element = document.createElement('div');
  $element.innerText = message;
  
  if (from === username) $element.classList.add('user-message');
  else $element.classList.add('channel-message');
  
  $message.appendChild($element);
  scrollDown();
}

$form.addEventListener("submit", (event) => {
  event.preventDefault();
  generalChannel.sendMessage($input.value);
  $input.value = '';
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

  generalChannel.on('messageAdded', message => {
    printMessage(message.author, message.body);
  });

  $input.disabled = false;
  $input.focus();
}

function handleErr (err) { console.log(err) }