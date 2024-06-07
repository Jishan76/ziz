module.exports = {
	config: {
		name: "image", 
		version: "1.0", 
		author: "jariph",
		countDown: 5,
		role: 0, 
		shortDescription: {
			vi: "đây là mô tả ngắn của lệnh",
			en: "this is short description of command"
		}, 
		longDescription: {
			vi: "đây là mô tả dài của lệnh",
			en: "this is long description of command"
		},
		category: "categoryName", 
		guide: {
			vi: "đây là hướng dẫn sử dụng của lệnh",
			en: "this is guide of command"
		}
	},

	langs: {
		vi: {
			hello: "xin chào",
			helloWithName: "xin chào, id facebook của bạn là %1"
		}, 
		en: {
			hello: "hello world",
			helloWithName: "hello, your facebook id is %1"
		} 
	},

	onStart: async function ({ api, args, message, event, threadsData, usersData, dashBoardData, globalData, threadModel, userModel, dashBoardModel, globalModel, role, commandName, getLang }) {

  // Unsplash API endpoint and access key
  var unsplashAPI = 'https://api.unsplash.com/photos/random?count=5&client_id=KSN_VrR6LNbXQqBy7nvarobNDjmQVuQ3bmUSX4GqPVo';

  // Function to fetch images from Unsplash API and display the slideshow
  function displaySlideshow() {
    var slideshowContainer = document.getElementById('slideshow-container');

    // Fetch images from Unsplash API
    fetch(unsplashAPI)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        // Create an image element for each image in the API response
        data.forEach(function(photo) {
          var img = document.createElement('img');
          img.src = photo.urls.regular;
          slideshowContainer.appendChild(img);
        });
      })
      .catch(function(error) {
        console.log('Error fetching images:', error);
      });
  }

    displaySlideshow();
	
		message.reply(getLang("hello"));
		
	}
};