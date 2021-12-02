/* eslint-disable */

const itemCreateDtoInType = shape({
    listId: id().isRequired(),
    text: string(1,1000).isRequired(),
    highPriority: boolean()
  });

  const itemGetDtoInType = shape({
    id: id().isRequired()
  });

  const itemUpdateDtoInType = shape({
    id: id().isRequired(),
    listId: id(),
    text: string(1,1000),
    highPriority: boolean()
  });

  const itemSetFinalStateDtoInType = shape({
    id: id().isRequired(),
    state: oneOf(["completed", "cancelled"]).isRequired()
  });

  const itemDeleteDtoInType = shape({
    id: id().isRequired()
  });

  const itemListDtoInType = shape({
    listId: id(),
    state: oneOf(["active", "completed", "cancelled"]),
    pageInfo: shape({
      pageIndex: integer(),
      pageSize: integer()
    })
  })



  