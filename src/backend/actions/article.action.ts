import { User } from "../models/domain-models";
import { persistenceRepository } from "../persistence-repositories";
import { PersistentRepository } from "../persistence/persistence.repository";

class UserAction {
  constructor(private readonly userAction: PersistentRepository<User>) {}
}

export const userAction = new UserAction(persistenceRepository.user);
