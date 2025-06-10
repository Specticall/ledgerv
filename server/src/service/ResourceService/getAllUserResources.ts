import UserResourceRepository from "../../repository/UserResourceRepository";

// Note: this service method should only retrieve 1 layers deep in the resource tree
const getAllUserResources = async (userId: number, parentId?: string) => {
  // if parent id does not exist, it should grab all the root resources
  const files = await UserResourceRepository.getUserFilesByParentId(
    userId,
    parentId
  );
  const folders = await UserResourceRepository.getUserFoldersByParentId(
    userId,
    parentId
  );

  return { files, folders };
};

export default getAllUserResources;
