async function connectClient (username) {
  function fetchAccessToken (username) {
    return new Promise((resolve, reject) => {
      axios.post('/token', { identity: username, device: 'browser' })
        .then(response => resolve(response.data.token))
        .catch(error => reject(error));
    })
  }

  async function createClient (token) {
    return Twilio.Chat.Client.create(token);
  }

  async function joinGeneralChannel () {
    const channels = await client.getPublicChannelDescriptors();

    if (!channels.items.length) {
      await client.createChannel({
        uniqueName: 'general',
        friendlyName: 'General'
      });
    }
  }

  const token = await fetchAccessToken(username);
  const client = await createClient(token);
  joinGeneralChannel();

  return {
    client,
    channels: (await client.getPublicChannelDescriptors()).items
  }
}


(async () => {
  const client = await connectClient('niel5')
  const channels = (await client.getPublicChannelDescriptors()).items;
  console.log(client)

  let $channelsList = document.getElementById('channels-list')
  channels.forEach(channel => {
    let $channel = document.createElement('div');
    $channel.innerHTML = `<li>${channel.friendlyName}</li>`

    console.log(channel.friendlyName)
    $channelsList.appendChild($channel)
  })
})()