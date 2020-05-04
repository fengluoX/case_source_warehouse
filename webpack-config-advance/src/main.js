import '@/index.scss';

import('./chunk');

import 'bootstrap';

if (module && module.hot) {
    module.hot.accept()
}

const arr = [];
console.log(1134);

fetch("/api/user")
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));