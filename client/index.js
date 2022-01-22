// const PoSs = await axios.get('http://localhost:8080/api/pos/')
// PoSs.data.forEach(async el => {
//     const {pos_id, name} = el;
//     console.log(`  (${pos_id}) ${name}`)
// })
//
// console.error('--chosen "noun"...')
// const cats = await axios.get(`http://localhost:8080/api/pos/${PoSs.data[0].pos_id}/category/`)
// cats.data.forEach(el => {
//     console.log(`  noun.${el.name} (varchar 50) >_`)
// })

const fetchSpellings = async () => {
	const lemma = document.getElementById('lemma').value;
	console.log({ lemma });
	const reqSpellings = await axios.post(
		`http://localhost:8080/api/spelling/${lemma}/`
	);
	const el = document.getElementById('spelling');
	el.innerHTML = JSON.stringify(reqSpellings.data);
};

const fetchPoS = async () => {
	const reqSpellings = await axios.get(`http://localhost:8080/api/pos/`);
	const el = document.getElementById('dog-names');
	reqSpellings.data.forEach((pos) => {
		el.innerHTML += `<option value="${pos.pos_id}">${pos.name}${
			pos.description ?? ''
		}</option>`;
	});
	console.log(reqSpellings.data);
};
