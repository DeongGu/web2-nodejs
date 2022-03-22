//array, object

let f = function f1(){
    console.log(1+2);
    console.log(1+1);
}
console.log(f);
f();

let a = [f];
a[0]();

let o = {
    func:f
}
o.func();

if(true){console.log(1)};
while(true){console.log(1)};