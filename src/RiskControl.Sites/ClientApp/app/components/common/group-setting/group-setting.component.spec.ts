import { Component, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupSettingModule, GroupSettingService, GroupSettingComponent } from './index';
import { expect, Helper } from '../../../testing';
import { fakeProductBetTypeSettings } from './group-setting.model.spec';

describe('GroupSettingComponent', () => {
    let fixture: ComponentFixture<GroupSettingComponent>;
    let component: GroupSettingComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                GroupSettingModule.forRoot()
            ], providers: [
                { provide: NgbActiveModal }
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GroupSettingComponent);
        component = fixture.componentInstance;
    });

    describe('empty data', () => {
        beforeEach(() => {
            component.updateSettings([], 'Product 1');
            fixture.detectChanges();
        });

        it('should not show any grids', () => {
            const grids = fixture.debugElement.queryAll(By.css('.grid'));
            expect(grids.length).toBe(0);
        });
    });

    describe('data binding', () => {
        let grids: DebugElement[];

        beforeEach(() => {
            component.updateSettings(fakeProductBetTypeSettings, 'Product 1');
            fixture.detectChanges();
            grids = fixture.debugElement.queryAll(By.css('.grid'));
        });

        it('should have 2 grids', () => {
            expect(grids.length).toBe(2);
        });

        describe('Grid 1', () => {
            let grid: DebugElement;
            let tables: DebugElement[];
            let toggleIcon: DebugElement;

            beforeEach(() => {
                grid = grids[0];
                tables = grid.queryAll(By.css('table'));
                toggleIcon = grid.query(By.css('.fa'));
            });

            it('should have 3 tables', () => {
                expect(tables.length).toBe(3);
            });

            it('should show icon class "fa-minus-square"', () => {
                expect(toggleIcon.nativeElement).toHaveCssClass('fa-minus-square');
            });

            it('should display content "Product 1" in first table', () => {
                expect(tables[0].nativeElement.textContent.trim()).toBe('Product 1');
            });

            it('should display column headers in second table', () => {
                const cells = tables[1].queryAll(By.css('th'));
                const contents = cells.map(cell => cell.nativeElement.textContent.trim());
                expect(contents).toEqual(['Setting Group', 'Game Type']);
            });

            it('should display bet types in third table', () => {
                const cells = tables[2].queryAll(By.css('td'));
                const contents = cells.map(cell => cell.nativeElement.textContent.trim());
                expect(contents).toEqual(['Group 1', 'BetType 11', 'BetType 12', 'Group 2', 'BetType 21', 'BetType 22']);
            });

            describe('Toggle to hide grid', () => {
                beforeEach(() => {
                    Helper.raiseClickEvent(toggleIcon.nativeElement);
                    fixture.detectChanges();
                });

                it('should show icon class "fa-plus-square"', () => {
                    expect(toggleIcon.nativeElement).toHaveCssClass('fa-plus-square');
                });
            });
        });

        describe('Grid 2', () => {
            let grid: DebugElement;
            let toggleIcon: DebugElement;

            beforeEach(() => {
                grid = grids[1];
                toggleIcon = grid.query(By.css('.fa'));
            });

            it('should show icon class "fa-plus-square"', () => {
                expect(toggleIcon.nativeElement).toHaveCssClass('fa-plus-square');
            });

            it('should have 1 table', () => {
                const tables = grid.queryAll(By.css('table'));
                expect(tables.length).toBe(1);
            });

            it('should display content "Product 2"', () => {
                const content = grid.nativeElement.textContent.trim();
                expect(content).toBe('Product 2');
            });

            describe('Toggle to show grid', () => {
                beforeEach(() => {
                    Helper.raiseClickEvent(toggleIcon.nativeElement);
                    fixture.detectChanges();
                });

                it('should show icon class "fa-minus-square"', () => {
                    expect(toggleIcon.nativeElement).toHaveCssClass('fa-minus-square');
                });

                it('should hide grid 1', () => {
                    const grid1ToggleIcon = grids[0].query(By.css('.fa'));
                    expect(grid1ToggleIcon.nativeElement).toHaveCssClass('fa-plus-square');
                });
            });
        });
    });
});
