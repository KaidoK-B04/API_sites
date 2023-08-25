// ! SMOOTH MOUSE SCROLLING (got wrong, because: header is not shown)
// document.addEventListener('DOMContentLoaded', function () {
// 	const sections = document.querySelectorAll('section');
// 	let currentSectionIndex = 0;
// 	function scrollToNextSection(event) {
// 		if (event.deltaY > 0) {
// 			currentSectionIndex++;
// 		} else {
// 			currentSectionIndex--;
// 		}
// 		currentSectionIndex = Math.max(0, Math.min(currentSectionIndex, sections.length - 1));
// 		sections[currentSectionIndex].scrollIntoView({
// 			behavior: 'smooth',
// 			block: 'start',
// 		});
// 	}
// 	window.addEventListener('wheel', scrollToNextSection);
// });

// !BUTTONS IN HEADER (got wrong, dont work)
// document.addEventListener('DOMContentLoaded', function () {
// 	const navIndexButton = document.getElementById('navIndex');
// 	const sectionOneButton = document.getElementById('sectionOne');
// 	const sectionTwoButton = document.getElementById('sectionTwo');
// 	const sectionThreeButton = document.getElementById('sectionThree');

// 	navIndexButton.addEventListener('click', scrollToTop);
// 	sectionOneButton.addEventListener('click', scrollToSection);
// 	sectionTwoButton.addEventListener('click', scrollToSection);
// 	sectionThreeButton.addEventListener('click', scrollToSection);

// 	function scrollToTop() {
// 		window.scrollTo({ top: 0, behavior: 'smooth' });
// 	}

// 	function scrollToSection(event) {
// 		const sectionId = event.target.id;
// 		const targetSection = document.getElementById(sectionId);
// 		targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
// 	}
// });

// FIXED FOOTER BUTTON FOR SECTIONS
document.addEventListener('DOMContentLoaded', function () {
	const sections = document.querySelectorAll('section');
	const nextButton = document.querySelector('.fixed-footer');
	let currentSectionIndex = 0;

	nextButton.addEventListener('click', scrollToNextSection);

	function scrollToNextSection() {
		currentSectionIndex++;

		if (currentSectionIndex >= sections.length) {
			currentSectionIndex = 0;
			sections[currentSectionIndex].scrollIntoView({ behavior: 'smooth' });
		} else {
			sections[currentSectionIndex].scrollIntoView({ behavior: 'smooth' });
		}
	}
});

// SECTION 1 TITLE & PHOTOS
const apiUrl = 'https://jsonplaceholder.typicode.com/photos';
const albumContainer = document.getElementById('album-container');

fetch(apiUrl)
	.then((response) => response.json())
	.then((photos) => {
		const selectedPhotos = photos.slice(50, 53);
		const delays = [400, 200, 0];
		selectedPhotos.forEach((photo, i) => {
			const photoCard = document.createElement('div');
			const photoTitle = document.createElement('h2');
			photoTitle.textContent = photo.title;
			const photoImage = document.createElement('img');
			photoImage.src = photo.thumbnailUrl;
			photoImage.alt = photo.title;
			photoCard.appendChild(photoTitle);
			photoCard.appendChild(photoImage);

			setTimeout(() => {
				photoCard.classList.add('photo-card');
				albumContainer.appendChild(photoCard);
			}, delays[i]);
		});
	})
	.catch((error) => {
		console.error('Error fetching photos:', error);
	});

// ANIMATION FOR SECTION ELEMENTS
const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.classList.add('show');
		} else {
			entry.target.classList.remove('show');
		}
	});
});
const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

//SECTION 2 RANDOME DOG

const dogImage = document.getElementById('dog-image');
const dogVideo = document.getElementById('dog-video');
const videoSource = document.getElementById('video-source');
const nextButton = document.getElementById('next-button');

nextButton.addEventListener('click', fetchRandomDog);

let userInteracted = false;

document.addEventListener('click', () => {
	userInteracted = true;
});

function fetchRandomDog() {
	fetch('https://random.dog/woof.json')
		.then((response) => response.json())
		.then((data) => {
			const imageUrl = data.url;
			const isVideo = imageUrl.endsWith('.mp4');

			if (isVideo) {
				dogImage.style.display = 'none';
				dogVideo.style.display = 'block';
				videoSource.src = imageUrl;
				dogVideo.load();

				if (userInteracted) {
					dogVideo.play();
				}
			} else {
				dogVideo.style.display = 'none';
				dogImage.style.display = 'block';
				dogImage.src = imageUrl;
			}
		})
		.catch((error) => {
			console.error('Error fetching random dog:', error);
		});
}
fetchRandomDog();

// SECTION 3 SYKKEL API

const citiesSelect = document.getElementById('cities');
const resultsDiv = document.getElementById('results');

fetch('https://api.citybik.es/v2/networks')
	.then((response) => response.json())
	.then((data) => {
		const norwayCities = data.networks.filter((network) => network.location.country === 'NO');

		norwayCities.forEach((city) => {
			const option = document.createElement('option');
			option.value = city.id;
			option.textContent = city.location.city;
			citiesSelect.appendChild(option);
		});
	})
	.catch((error) => {
		console.error('Error fetching city data:', error);
	});

citiesSelect.addEventListener('change', () => {
	const selectedCityId = citiesSelect.value;

	if (selectedCityId) {
		fetch(`https://api.citybik.es/v2/networks/${selectedCityId}`)
			.then((response) => response.json())
			.then((data) => {
				resultsDiv.innerHTML = `
        <h3>${data.network.location.city}</h3>
        <h3>Country: ${data.network.location.country}</h3>
        <h3>Number of stations: ${data.network.stations.length}</h3>
         `;
			})
			.catch((error) => {
				console.error('Error fetching citybike data:', error);
			});
	} else {
		// CLEAR DIV
		resultsDiv.innerHTML = '';
	}
});
