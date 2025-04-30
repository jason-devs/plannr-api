export const validReference = async function (Model, id) {
  return Boolean(await Model.findById(id));
};

// export const validReferenceMessage = props =>
//   `"${props.path}" validation failed. It must be attached to a valid Project ID: ${props.value}`;

export const validReferenceMessage = (docName, props) =>
  `${docName} couldn't be created. It must be attached to a valid ${props.path.toUpperCase()} ID. This one didn't work: ${props.value}`;
