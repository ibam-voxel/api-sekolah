module.exports.paginate = (data) => {
  let total_page; let total_perpage; let next_page; let prev_page; let
    current_page;

  total_page = Math.ceil(data.count / data.per_page);
  total_perpage = data.per_page;
  current_page = data.page;
  prev_page = current_page == 1 ? null : current_page - 1;
  next_page = current_page == total_page ? null : current_page + 1;

  const result = {
    data: data.data,
    pagination: {
      total_records: data.count,
      total_per_page: total_perpage,
      total_page,
      current_page,
      next_page,
      prev_page,
    },
  };

  return result;
};