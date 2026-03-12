document.addEventListener("DOMContentLoaded", function () {
	let btnActive = 0;
	const buttonView = document.querySelector(".btn-view");
	const projectCard = document.querySelectorAll(".card-project");

	for (let i = 4; i < projectCard.length; i++) {
		projectCard[i].classList.add("hidden");
	}

	buttonView.addEventListener("click", function () {
		if (btnActive === 0) {
			for (let i = 4; i < projectCard.length; i++) {
				projectCard[i].classList.remove("hidden");
			}
			buttonView.innerText = "View Less Project";
			btnActive++;
		} else {
			for (let i = 4; i < projectCard.length; i++) {
				projectCard[i].classList.add("hidden");
			}
			buttonView.innerText = "View More Project";
			btnActive--;
		}
	});
});
