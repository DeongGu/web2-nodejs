const members = ['egoing', 'k8805', 'hoya'];
console.log(members[1]); // k8805
let i = 0;
while(i < members.length) {
    console.log('array loops', members[i]);
    i = i + 1;
}

const roles = {
    'programmer':'egoing',
    'designer': 'k8805',
    'manager': 'hoya'
}
console.log(roles.programmer);
console.log(roles['programmer']);

const role = {
    programmer:'egoing',
    designer: 'k8805',
    manager: 'hoya'
}

console.log(role);
console.log(roles);


for(const name in roles){
    console.log('object =>', name , 'value=>', roles[name]);
}