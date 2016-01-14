class StorageModel {
	constructor( table, model ){
		this._table = table;
		this._model = model;

		// 记录 model key值
		this._keys = Object.keys( model );

		this.setStorage();
	}

	// 检测数据模型配置Storage
	setStorage(){
		var _storageTable = localStorage.getItem( this._table );
		_storageTable = _storageTable ? JSON.parse( _storageTable ) : {};

		// 判断数据库字段和设置字段是否一样,如果不一样则删除数据库该‘表’,待重新加入数据
		if ( Object.keys( _storageTable ).toString() === this._keys.toString() ) return;
		else localStorage.removeItem( this._table );
	}

	// 查找 , 返回 Array 或者 null
	find( opt ) {
		var _storageTable = localStorage.getItem( this._table );
		var result = [];
		if( !_storageTable ) return null;
		_storageTable = JSON.parse( _storageTable );
		// 非条件查询 (没有带条件参数opt或者条件不是一个正常条件)
		if( !opt || opt.constructor.name !== 'Object' ){
			for( var i = 0, j = _storageTable[this._keys[0]].length; i < j; i++ ){
				var _result = {};
				this._keys.forEach( val => _result[val] = _storageTable[val][i] );
				result.push( _result );
			}
		}else 
			// 先条件查询，再筛选
			result = this._check( opt, this.find() ).result;

		return result;
	}

	// 查询一条数据，返回 Object 或者 null
	findOne( opt ) {
		var result = this.find( opt );
		if( result ) return result[0];
		else return result;
	}

	// 添加数据, 在表中添加一条记录
	save( value ) {
		var _storageTable = localStorage.getItem( this._table );
		_storageTable = _storageTable ? JSON.parse( _storageTable ) : {};

		// 只针对model 中配置的key值字段进行添加，其他没有字段不添加，
		// model 设置的字段如果value中没有默认设置为null
		this._keys.forEach( val => {
			_storageTable[val] = _storageTable[val] || [];
			_storageTable[val].push( value[val] || null );
		} );

		localStorage.setItem( this._table, JSON.stringify( _storageTable ) );
	}

	// 修改操作，必须带参数和值
	update( opt, value ) {
		if( !opt || !value || opt.constructor.name !== 'Object' || value.constructor.name !== 'Object' )
			throw new Error( '参数错误!' );

		var result = this.find();
		if( !result ) return;
		var checkResult = this._check( opt, result );

		checkResult.index.forEach( val => {
			for( var i in value ) 
				i in result[val] && (result[val][i] = value[i]);
		} );
		localStorage.setItem( this._table, JSON.stringify( this._format(result) ) );
	}

	// 删除, 不带条件全部删除
	remove( opt ) {
		if( !opt || opt.constructor.name !== 'Object' ) 
			localStorage.removeItem( this._table );
		else {
			var result = this.find();
			if( !result ) return;

			localStorage.setItem( this._table, JSON.stringify( this._format( this._check( opt, result ).notResult ) ) );
		}
	}

	// 检测匹配对象 , 返回满足条件的对象数组 和满足条件的 index 数组 以及不满足条件的数组
	_check( opt, arr ){
		var result = [];
		var $index = [];
		var notResult = [];
		arr.forEach( (val, index) => {
			for( var i in opt )
				// 符合条件 >= <= != 等
				if( opt[i].constructor.name === 'Object' ){
					// TODO
				}else
					if( val[i] !== opt[i] ) {
						notResult.push( val );
						return;
					};
			$index.push( index );		
			result.push( val );
		} );
		return {result: result,index: $index, notResult: notResult};
	}

	// 格式化数组为储存对象
	_format( o ){
		var result = {};
		for( var i in this._keys ){
			var _i = this._keys[i];
			result[_i] = [];
			o.forEach( v => result[_i].push(v[_i]) );
		}
		return result;
	}

}