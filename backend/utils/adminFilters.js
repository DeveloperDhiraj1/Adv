export const getPagination = (req) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);

  return {
    page,
    limit,
    skip: (page - 1) * limit
  };
};

export const getDateFilter = (dateFrom, dateTo, field = 'createdAt') => {
  const filter = {};

  if (dateFrom || dateTo) {
    filter[field] = {};

    if (dateFrom) {
      filter[field].$gte = new Date(`${dateFrom}T00:00:00.000Z`);
    }

    if (dateTo) {
      filter[field].$lte = new Date(`${dateTo}T23:59:59.999Z`);
    }
  }

  return filter;
};

export const getAmountFilter = (minAmount, maxAmount) => {
  const filter = {};

  if (minAmount !== undefined || maxAmount !== undefined) {
    filter.amount = {};

    if (minAmount !== undefined) {
      filter.amount.$gte = Number(minAmount);
    }

    if (maxAmount !== undefined) {
      filter.amount.$lte = Number(maxAmount);
    }
  }

  return filter;
};

export const getSort = (req) => {
  const sortBy = req.query.sortBy || 'createdAt';
  const order = req.query.order === 'asc' ? 1 : -1;

  const allowedSortFields = [
    'createdAt',
    'updatedAt',
    'amount',
    'status',
    'name',
    'email'
  ];

  return {
    [allowedSortFields.includes(sortBy) ? sortBy : 'createdAt']: order
  };
};