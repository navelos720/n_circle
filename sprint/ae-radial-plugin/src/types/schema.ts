/**
 * SCHEMA.md & DATA_MODEL.md TypeScript Contracts
 * Company After Effects Radial Suite
 */

export type ItemType = 
  | 'ae_command'
  | 'menu_item'
  | 'effect'
  | 'aep_file'
  | 'aep_template'
  | 'folder';

export interface BaseSlotItem {
  position: number;
  type: ItemType;
  label: string;
  icon?: string;
  description?: string;
}

export interface AeCommandSlotItem extends BaseSlotItem {
  type: 'ae_command';
  commandId: number;
  requiresSelection?: boolean;
}

export interface MenuItemSlotItem extends BaseSlotItem {
  type: 'menu_item';
  commandId?: number;
  menuPath?: string;
}

export interface EffectSlotItem extends BaseSlotItem {
  type: 'effect';
  effectName: string;
  category?: string;
}

export interface AepFileSlotItem extends BaseSlotItem {
  type: 'aep_file';
  aepFilePath: string;
  id?: string;
}

export interface AepTemplateSlotItem extends BaseSlotItem {
  type: 'aep_template';
  templateId: string;
  aepFilePath?: string;
  targetCompName?: string;
  placeholderLayerName?: string;
}

export interface FolderSlotItem extends BaseSlotItem {
  type: 'folder';
  children: SlotItem[];
}

export type SlotItem = 
  | AeCommandSlotItem 
  | MenuItemSlotItem 
  | EffectSlotItem 
  | AepFileSlotItem 
  | AepTemplateSlotItem 
  | FolderSlotItem;

export interface WheelProfile {
  name: string;
  description?: string;
  slots: SlotItem[];
}

export interface WheelConfig {
  activeProfile: string;
  profiles: WheelProfile[];
}

export interface TemplateEntry {
  id: string;
  name: string;
  thumbnail?: string;
  aepFilePath: string;
  targetCompName?: string;
  placeholderLayerName?: string;
  tags?: string[];
  category?: string;
  description?: string;
}

export interface CategoryEntry {
  id: string;
  name: string;
  templates: TemplateEntry[];
}

export interface LibraryData {
  libraryVersion: string;
  rootPath: string;
  categories: CategoryEntry[];
}

export interface AppSettings {
  activationTrigger: 'hotkey' | 'hotkey_and_hold';
  holdDelayMs: number;
  interactionMode: 'gesture' | 'click';
  uiScale: number;
  rootPath: string;
  theme: 'dark' | 'light';
  animationSpeedMs: number;
}
