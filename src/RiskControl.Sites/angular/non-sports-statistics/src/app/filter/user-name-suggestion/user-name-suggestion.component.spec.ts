import { Component, DebugElement } from '@angular/core';
import { TestBed, ComponentFixture, async, tick, fakeAsync } from '@angular/core/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { RoleId } from '../../common';
import { UserNameSuggestionService, UserNameSuggestionComponent, UserNameSuggestionModule } from './index';
import { expect, eventHelper, createGenericTestComponent } from '../../../testing';

const fakeComponentInput = {
    roleId: RoleId.Member
};

@Component({
    selector: 'nap-test',
    template: ''
})
class TestComponent {
    roleId = fakeComponentInput.roleId;
    onUserNameSuggestionComplete(userNames: string) { }
}

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

describe('UserNameSuggestionComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                UserNameSuggestionModule
            ],
            declarations: [
                TestComponent
            ]
        });
    });

    describe('default template', () => {
        let fixture: ComponentFixture<TestComponent>;
        let hostElement: DebugElement;
        let inputs: DebugElement[];
        let dropdown: DebugElement;
        let spy: jasmine.Spy;

        function setupInstances() {
            hostElement = fixture.debugElement.query(By.css('nap-user-name-suggestion'));
            inputs = hostElement.queryAll(By.css('input'));
            dropdown = hostElement.query(By.css('.dropdown'));
            const service = fixture.debugElement.injector.get(UserNameSuggestionService);
            const fakeData = ['aa1', 'aa2'];
            spy = spyOn(service, 'getUsernameSuggestion').and.returnValue(of(fakeData));
        }

        describe('component without input', () => {
            beforeEach(() => {
                fixture = createTestComponent('<nap-user-name-suggestion></nap-user-name-suggestion>');
                setupInstances();
            });

            it('should have 2 inputs', () => {
                expect(inputs.length).toBe(2);

                // the first input should be hidden
                expect(inputs[0].nativeElement).toHaveCssClass('hidden');

                // the second input should be not focus after initialzied
                expect(document.activeElement).not.toBe(inputs[1].nativeElement);
            });

            it('should focus on input after click on host', () => {
                hostElement.nativeElement.click();
                fixture.detectChanges();
                expect(document.activeElement).toBe(inputs[1].nativeElement);
            });

            it('should not invoke getUsernameSuggestion when input a text = 1 character', () => {
                eventHelper.raiseInput(inputs[1].nativeElement, 'a');
                fixture.detectChanges();
                expect(spy.calls.any()).toBe(false);
            });

            it('should hide dropdown by default', () => {
                expect(dropdown.nativeElement).not.toHaveCssClass('show');
            });
        });

        describe('input a text >=2 characters', () => {
            const term = 'aa';

            function validate(roleId) {
                eventHelper.raiseInput(inputs[1].nativeElement, term);
                fixture.detectChanges();
                expect(spy.calls.any()).toBeTruthy();
                const args = spy.calls.mostRecent().args;
                expect(args[0]).toBe(term);
                expect(args[1]).toBe(roleId);
            }

            it('should invoke getUsernameSuggestion with default roleId=Member', () => {
                fixture = createTestComponent('<nap-user-name-suggestion></nap-user-name-suggestion>');
                setupInstances();
                validate(RoleId.Member);
            });

            it('should invoke getUsernameSuggestion with input roleId', () => {
                fakeComponentInput.roleId = RoleId.Super;
                fixture = createTestComponent('<nap-user-name-suggestion [roleId]="roleId"></nap-user-name-suggestion>');
                setupInstances();
                validate(RoleId.Super);
            });

            describe('dropdown', () => {
                let suggestedElements: DebugElement[];

                beforeEach(() => {
                    fixture = createTestComponent('<nap-user-name-suggestion></nap-user-name-suggestion>');
                    fixture.detectChanges();
                    setupInstances();
                    eventHelper.raiseInput(inputs[1].nativeElement, 'aa');
                    fixture.detectChanges();
                    suggestedElements = dropdown.queryAll(By.css('.dropdown-item'));
                });

                it('should be shown', () => {
                    expect(dropdown.nativeElement).toHaveCssClass('show');
                });

                it('should be hidden when click out of host component', () => {
                    expect(dropdown.nativeElement).toHaveCssClass('show');
                    document.body.click();
                    fixture.detectChanges();
                    expect(dropdown.nativeElement).not.toHaveCssClass('show');
                });

                it('should be hidden when press key Esc', () => {
                    eventHelper.raiseKeydown(inputs[1].nativeElement, 'Escape');
                    fixture.detectChanges();
                    expect(dropdown.nativeElement).not.toHaveCssClass('show');
                });

                it('should have 2 suggested elements but not be actived', () => {
                    expect(suggestedElements.length).toBe(2);
                    expect(suggestedElements[0].nativeElement).not.toHaveCssClass('active');
                    expect(suggestedElements[1].nativeElement).not.toHaveCssClass('active');
                });

                describe('press key ArrowDown', () => {

                    beforeEach(() => {
                        eventHelper.raiseKeydown(inputs[1].nativeElement, 'ArrowDown');
                        fixture.detectChanges();
                    });

                    it('should active the first item', () => {
                        expect(suggestedElements[0].nativeElement).toHaveCssClass('active');
                    });

                    it('should select the first item when press "Enter"', () => {
                        eventHelper.raiseKeydown(inputs[1].nativeElement, 'Enter');
                        fixture.detectChanges();
                        const selectedElements = hostElement.queryAll(By.css('.search-choice'));
                        expect(selectedElements.length).toBe(1);
                        expect(selectedElements[0].nativeElement).toHaveTrimmedText('aa1');
                    });

                    describe('press key ArrowDown the second time', () => {
                        beforeEach(() => {
                            eventHelper.raiseKeydown(inputs[1].nativeElement, 'ArrowDown');
                            fixture.detectChanges();
                        });

                        it('should active the second item', () => {
                            expect(suggestedElements[1].nativeElement).toHaveCssClass('active');
                        });

                        it('should keep the second item is actived when press key ArrowDown', () => {
                            eventHelper.raiseKeydown(inputs[1].nativeElement, 'ArrowDown');
                            fixture.detectChanges();
                            expect(suggestedElements[1].nativeElement).toHaveCssClass('active');
                        });

                        describe('press key ArrowUp', () => {
                            beforeEach(() => {
                                eventHelper.raiseKeydown(inputs[1].nativeElement, 'ArrowUp');
                                fixture.detectChanges();
                            });

                            it('should active the first item', () => {
                                expect(suggestedElements[0].nativeElement).toHaveCssClass('active');
                            });

                            it('should keep activating the first item when press key ArrowUp', () => {
                                eventHelper.raiseKeydown(inputs[1].nativeElement, 'ArrowUp');
                                fixture.detectChanges();
                                expect(suggestedElements[0].nativeElement).toHaveCssClass('active');
                            });
                        });
                    });
                });

                describe('selected userNames', () => {

                    it('should accept input value by Tab, Enter, Comma keys', () => {
                        function shouldAcceptCode(code: string) {
                            eventHelper.raiseKeydown(inputs[1].nativeElement, code);
                            fixture.detectChanges();
                            const selectedElements = hostElement.queryAll(By.css('.search-choice'));
                            expect(selectedElements.length).toBe(1);
                            expect(selectedElements[0].nativeElement).toHaveTrimmedText('aa');
                        }

                        shouldAcceptCode('Tab');
                        shouldAcceptCode('Enter');
                        shouldAcceptCode('Comma');
                    });

                    // it('should add selected user names when paste a string of user names', () => {
                    //     const event = new ClipboardEvent('paste', {
                    //         dataType: 'text/plain',
                    //         data: 'aa1, aa2'
                    //     });
                    //     eventHelper.raise(inputs[1].nativeElement, event);
                    //     fixture.detectChanges();
                    //     const selectedElements = hostElement.queryAll(By.css('.search-choice'));
                    //     expect(selectedElements[0].nativeElement).toHaveTrimmedText('aa1');
                    //     expect(selectedElements[1].nativeElement).toHaveTrimmedText('aa2');
                    // });

                    describe('select "aa1"', () => {
                        beforeEach(() => {
                            eventHelper.raiseKeydown(inputs[1].nativeElement, 'ArrowDown');
                            fixture.detectChanges();
                            eventHelper.raiseKeydown(inputs[1].nativeElement, 'Enter');
                            fixture.detectChanges();
                        });

                        it('should display "aa1" as selected userNames', () => {
                            const selectedElements = hostElement.queryAll(By.css('.search-choice'));
                            expect(selectedElements.length).toBe(1);
                            expect(selectedElements[0].nativeElement).toHaveTrimmedText('aa1');
                        });

                        it('should clear input after selecting', () => {
                            expect(inputs[0].nativeElement.value).toBe('');
                        });

                        it('should remove "aa1" when clicking close icon', () => {
                            let selectedElements = hostElement.queryAll(By.css('.search-choice'));
                            const closeIcon = selectedElements[0].query(By.css('.fa-times'));
                            closeIcon.nativeElement.click();
                            fixture.detectChanges();
                            selectedElements = hostElement.queryAll(By.css('.search-choice'));
                            expect(selectedElements.length).toBe(0);
                        });

                        it('should remove "aa1" when press key Backspace on input', () => {
                            eventHelper.raiseKeydown(inputs[1].nativeElement, 'Backspace');
                            fixture.detectChanges();
                            const selectedElements = hostElement.queryAll(By.css('.search-choice'));
                            expect(selectedElements.length).toBe(0);
                        });

                        it('should remove active item when press key Delete on hidden input', () => {
                            let selectedElements = hostElement.queryAll(By.css('.search-choice'));
                            selectedElements[0].nativeElement.click();
                            fixture.detectChanges();
                            eventHelper.raiseKeydown(inputs[0].nativeElement, 'Delete');
                            fixture.detectChanges();
                            selectedElements = hostElement.queryAll(By.css('.search-choice'));
                            expect(selectedElements.length).toBe(0);
                        });

                        describe('select "aa2" & "aa3"', () => {
                            let selectedElements: DebugElement[];

                            beforeEach(() => {
                                eventHelper.raiseInput(inputs[1].nativeElement, 'aa2,aa3,');
                                fixture.detectChanges();
                                selectedElements = hostElement.queryAll(By.css('.search-choice'));
                            });

                            it('should display "aa1", "aa2" & "aa3" as selected userNames', () => {
                                expect(selectedElements.length).toBe(3);
                                expect(selectedElements[0].nativeElement).toHaveTrimmedText('aa1');
                                expect(selectedElements[1].nativeElement).toHaveTrimmedText('aa2');
                                expect(selectedElements[2].nativeElement).toHaveTrimmedText('aa3');
                            });

                            it('should support to select multiple items by Ctrl', () => {
                                selectedElements[0].nativeElement.click();
                                fixture.detectChanges();
                                const event = new MouseEvent('click', {
                                    bubbles: true,
                                    cancelable: true,
                                    ctrlKey: true
                                });
                                expect(selectedElements[1].nativeElement).not.toHaveCssClass('active');
                                eventHelper.raise(selectedElements[2].nativeElement, event);
                                fixture.detectChanges();
                                expect(selectedElements[0].nativeElement).toHaveCssClass('active');
                                expect(selectedElements[1].nativeElement).not.toHaveCssClass('active');
                                expect(selectedElements[2].nativeElement).toHaveCssClass('active');
                            });

                            it('should support to select multiple items by Shift', () => {
                                selectedElements[0].nativeElement.click();
                                fixture.detectChanges();
                                const event = new MouseEvent('click', {
                                    bubbles: true,
                                    cancelable: true,
                                    shiftKey: true
                                });
                                eventHelper.raise(selectedElements[2].nativeElement, event);
                                fixture.detectChanges();
                                selectedElements.forEach(element => {
                                    expect(element.nativeElement).toHaveCssClass('active');
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
