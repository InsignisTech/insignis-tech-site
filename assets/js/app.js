// Burger menu
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav-links');
if (burger && navLinks) {
	burger.addEventListener('click', () => {
		navLinks.classList.toggle('active');
	});
}

// Contact form validation and message (RODO/zero trust)
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');
if (contactForm && formMsg) {
	contactForm.addEventListener('submit', function(e) {
		e.preventDefault();
		const inputs = contactForm.querySelectorAll('input, textarea');
		let valid = true;
		inputs.forEach(input => {
			if (input.type !== 'checkbox' && !input.value.trim()) valid = false;
		});
		if (!valid) {
			formMsg.textContent = 'Wypełnij wszystkie pola.';
			formMsg.style.color = 'red';
			return;
		}
		// Simple email validation
		const emailInput = contactForm.querySelector('input[type="email"]');
		if (emailInput && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailInput.value.trim())) {
			formMsg.textContent = 'Podaj poprawny adres email.';
			formMsg.style.color = 'red';
			return;
		}
		// RODO checkbox validation
		const rodoCheckbox = document.getElementById('rodo');
		if (!rodoCheckbox || !rodoCheckbox.checked) {
			formMsg.textContent = 'Musisz wyrazić zgodę na przetwarzanie danych (RODO).';
			formMsg.style.color = 'red';
			return;
		}
		formMsg.textContent = 'Dziękujemy za kontakt!';
		formMsg.style.color = 'limegreen';
		contactForm.reset();
	});
}
console.log('INSIGNIS TECH: strona działa');
