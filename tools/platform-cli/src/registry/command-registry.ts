/**
 * @file command-registry.ts
 * @module @ecosystem/platform-cli/registry
 *
 * Explicit command registry with deterministic ordering and duplicate rejection.
 */

import type { PlatformCliCommand } from '../contracts/cli-command.contract.js';

export class PlatformCliCommandRegistry {
  private readonly commands = new Map<string, PlatformCliCommand>();
  private readonly aliases = new Map<string, string>();

  /**
   * Registers a command handler.
   * Throws an Error if a duplicate name or alias is detected.
   */
  public register(command: PlatformCliCommand): void {
    if (!command || typeof command.name !== 'string' || !command.name.trim()) {
      throw new Error('Invalid command registration: command must have a valid non-empty name.');
    }

    const normalizedName = command.name.trim().toLowerCase();

    if (!/^[a-z][a-z0-9-]*$/.test(normalizedName)) {
      throw new Error(
        `Invalid command name "${normalizedName}": must start with a lowercase letter and contain only alphanumeric characters and hyphens.`
      );
    }

    if (this.commands.has(normalizedName)) {
      throw new Error(
        `Duplicate command registration: command with name "${normalizedName}" is already registered.`
      );
    }

    if (this.aliases.has(normalizedName)) {
      throw new Error(
        `Naming conflict: command name "${normalizedName}" conflicts with an existing alias.`
      );
    }

    if (command.aliases) {
      for (const alias of command.aliases) {
        const normalizedAlias = alias.trim().toLowerCase();
        if (this.commands.has(normalizedAlias) || this.aliases.has(normalizedAlias)) {
          throw new Error(
            `Duplicate alias registration: alias "${normalizedAlias}" conflicts with an existing command or alias.`
          );
        }
      }
    }

    this.commands.set(normalizedName, command);

    if (command.aliases) {
      for (const alias of command.aliases) {
        const normalizedAlias = alias.trim().toLowerCase();
        this.aliases.set(normalizedAlias, normalizedName);
      }
    }
  }

  /**
   * Resolves a command by its primary name or alias.
   */
  public get(nameOrAlias: string): PlatformCliCommand | undefined {
    const key = nameOrAlias.trim().toLowerCase();
    const primaryName = this.aliases.get(key) ?? key;
    return this.commands.get(primaryName);
  }

  /**
   * Returns true if a command or alias is registered.
   */
  public has(nameOrAlias: string): boolean {
    const key = nameOrAlias.trim().toLowerCase();
    return this.commands.has(key) || this.aliases.has(key);
  }

  /**
   * Returns all distinct registered commands in deterministic alphabetical order.
   */
  public getAll(): readonly PlatformCliCommand[] {
    return Array.from(this.commands.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  /**
   * Returns all primary command names in deterministic alphabetical order.
   */
  public getRegisteredNames(): readonly string[] {
    return Array.from(this.commands.keys()).sort();
  }
}
