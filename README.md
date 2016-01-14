# StorageModel

仿 `mongodb` 接口的一套操作 `localStorage` 操作的API;

## 源码

源码在 `src` 目录下面，通过 `ES6` 标准书写的代码，外面代码已经编译成 `ES5` 标准的代码。

**如果需要在 `AMD`, `CMD`, `CommonJS`下使用，修改源码在最后加上 `module.exports = StorageModel;`,同时 `npm install` 安装依赖包后 `gulp` 重新编译一次代码即可。**

## API

### `new StorageModel( name, opt )`

```js
var UserModel = new StorageModel( 'users', {
	name: String,
	age: Number,
	email: String,
	sex: String
} );
```

### 添加数据 `model.save()`

```js
UserModel.save({
	name: 'tenfour',
	age: 24,
	email: 'liaoqingsong@tenfour.cn',
	nickname: 'tenfour'
});
```
**数据模型没有的数据添加时候会被自动忽略掉，不会保存（如昵称nickname）；**
**模型中有添加未设置的数据默认值为null（如性别sex）**

### 查询 `model.find( opt )/model.findOne( opt )`

```js

// 不带参数 查询全部 返回 Array 或者 null
UserModel.find();

// 带参数查询
// 查询 性别(sex)为男('M'),年龄(age)为18的所有数据
UserModel.find( {sex: 'M', age: 18} );

// 返回第一条（有参数就匹配满足条件）数据或者null
UserModel.findOne(opt);
```

### 修改数据 `model.update( opt, value )`

```js
// 两个参数都不能为空
// 根据条件(opt)修改数据(value)

// 修改年龄为18岁的名字改为'tenfour'
UserModel.update( {age: 18},{name:'tenfour'} );
```

### 删除操作 `model.remove( opt )`

```js
// 不带参数删除该 model 所有数据
UserModel.remove();

// 条件删除,删除年龄为18岁的,并且名字为'tenfour'的
UserModel.remove({age:18, name: 'tenfour'});

```

**PS 复合条件查询和数据类型判断待完善！**