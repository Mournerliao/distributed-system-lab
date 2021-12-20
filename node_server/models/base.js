const knex = require('./knex');

class Base {
  constructor(props) {
    this.table = props;
  }

  // 全部查找
  all() {
    return knex(this.table).select();
  }

  // 全列查找
  selectAllColumns(condition, value) {
    return knex(this.table).where(condition, value);
  }

  // 具体列查找
  selectSomeColumns(column, condition, value) {
    return knex(this.table).where(condition, value).select(column);
  }

  selectJoinTables(joinTable, tableColumn, joinTableColumn, params, condition, value) {
    return knex(this.table).join(joinTable,
      `${this.table}.${tableColumn}`, '=', `${joinTable}.${joinTableColumn}`)
      .select(...params)
      .where(condition, value);
  }

  // 新增
  insert(params) {
    return knex(this.table).insert(params);
  }

  // 更改
  update(id, params) {
    return knex(this.table).where('id', '=', id).update(params);
  }

  // 删除
  delete(id) {
    return knex(this.table).where('id', '=', id).del();
  }
}

module.exports = Base;
