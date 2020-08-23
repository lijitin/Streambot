'use strict';
/*exported  AmqAwesomeplete*/

function AmqAwesomeplete(input, o, scrollable) {
	o.filter = (text, input) => {
		return RegExp(input.trim(), "i").test(text);
	};
	Awesomplete.call(this, input, o);
	this.searchId = 0;
	this.currentSubList = null;

	this.letterLists = {};
	o.list.forEach(inputEntry => {
		let handledChars = {};
		let label;
		if (o.data) {
			label = o.data(inputEntry).label;
		} else {
			label = inputEntry;
		}
		label.split('').forEach(char => {
			let lowerChar = char.toLowerCase();
			if (!handledChars[lowerChar]) {
				let altChar;
				if (!/[a-bA-Z0-9-]/.test(lowerChar)) {
					if (/[ōóòöôøΦ]/.test(lowerChar)) {
						altChar = 'o';
					} else if (/[ä@âàáạåæā]/.test(lowerChar)) {
						altChar = 'a';
					} else if (char === 'č') {
						altChar = 'c';
					} else if (/[éêëèæ]/.test(lowerChar)) {
						altChar = 'e';
					} else if (char === '’') {
						altChar = '\'';
					} else if (char === 'ñ') {
						altChar = 'n';
					} else if (char === 'í') {
						altChar = 'i';
					} else if (char === '×') {
						altChar = 'x';
					} else if (char === 'ß') {
						altChar = 'b';
					}
				}
				if (!this.letterLists[lowerChar]) {
					this.letterLists[lowerChar] = [];
				}
				this.letterLists[lowerChar].push(inputEntry);
				handledChars[lowerChar] = true;
				if (altChar && !handledChars[altChar]) {
					if (!this.letterLists[altChar]) {
						this.letterLists[altChar] = [];
					}
					this.letterLists[altChar].push(inputEntry);
					handledChars[altChar] = true;
				}
			}
		});
	});

	this.currentQuery = "";
	this.$ul = $(this.ul);

	if (scrollable) {
		let $input = $(input);
		let $awesompleteList = $input.parent().find('ul');
		$awesompleteList.perfectScrollbar({
			suppressScrollX: true
		});

		$input.on('awesomplete-open', () => {
			$awesompleteList.perfectScrollbar('update');
			$awesompleteList[0].scrollTop = 0;
		});
	}

	let create = function (tag, o) {
		var element = document.createElement(tag);

		for (var i in o) {
			var val = o[i];

			if (i === "inside") {
				$(val).appendChild(element);
			}
			else if (i === "around") {
				var ref = $(val);
				ref.parentNode.insertBefore(element, ref);
				element.appendChild(ref);

				if (ref.getAttribute("autofocus") != null) {
					ref.focus();
				}
			}
			else if (i in element) {
				element[i] = val;
			}
			else {
				element.setAttribute(i, val);
			}
		}

		return element;
	};

	this.item = function (text, input, item_id) {
		var html = input.trim() === "" ? text : text.replace(RegExp(input.trim(), "gi"), "<mark>$&</mark>");
		return create("li", {
			innerHTML: html,
			"role": "option",
			"aria-selected": "false",
			"id": "awesomplete_list_" + this.count + "_item_" + item_id
		});
	};
}

AmqAwesomeplete.prototype = Object.create(Awesomplete.prototype);
AmqAwesomeplete.prototype.constructor = AmqAwesomeplete;

AmqAwesomeplete.prototype.evaluate = function () {
	var me = this;
	let unescapedValue = this.input.value;
	var value = createAnimeSearchRegexQuery(unescapedValue);
	let inputList;

	if (this.currentQuery && new RegExp(this.currentQuery, 'i').test(unescapedValue) && this.currentSubList) {
		inputList = this.currentSubList;
	} else if (unescapedValue.length > 0) {
		let letterList = this.letterLists[unescapedValue[0].toLowerCase()];
		if (letterList) {
			inputList = letterList;
		} else {
			inputList = [];
		}
		this.currentSubList = inputList;
	} else {
		inputList = this._list;
		this.currentSubList = null;
	}

	this.currentQuery = value;

	if (value.length >= this.minChars && inputList.length > 0) {
		this.searchId++;
		var currentSearchId = this.searchId;
		$("#qpAnswerInputLoadingContainer").removeClass("hide");
		this.index = -1;
		// Populate list with options that match
		this.$ul.children('li').remove();

		var suggestions = [];
		let selectedItems = [];

		let handlePassedSuggestions = function (me) {
			if (this.sort !== false) {
				this.suggestions = this.suggestions.sort(this.sort);
			}
			this.currentSubList = selectedItems;
			this.suggestions = this.suggestions.slice(0, this.maxItems);

			for (let i = this.suggestions.length - 1; i >= 0; i--) {
				let text = this.suggestions[i];
				me.ul.insertBefore(me.item(text, value, i), me.ul.firstChild);
			}

			if (this.ul.children.length === 0) {

				this.status.textContent = "No results found";

				this.close({ reason: "nomatches" });

			} else {
				this.open();
				this.status.textContent = this.ul.children.length + " results found";
			}
			$("#qpAnswerInputLoadingContainer").addClass("hide");
		}.bind(this);

		let timeoutLoop = function (index, me, handlePassedSuggestions, currentSearchId) {
			if (currentSearchId !== this.searchId) {
				return;
			}

			if (index < inputList.length) {
				for (let i = index; i < inputList.length && i < index + 1000; i++) {
					let item = inputList[i];
					let suggestion = new Suggestion(me.data(item, value));
					if (me.filter(suggestion, value)) {
						selectedItems.push(item);
						suggestions.push(suggestion);
					}
				}
				setTimeout(function () {
					timeoutLoop(index + 1000, me, handlePassedSuggestions, currentSearchId);
				}.bind(this), 10);
			} else {
				this.suggestions = suggestions;
				handlePassedSuggestions(me);
			}
		}.bind(this);

		timeoutLoop(0, me, handlePassedSuggestions, currentSearchId);
	}
	else {
		this.close({ reason: "nomatches" });

		this.status.textContent = "No results found";
	}
};

AmqAwesomeplete.prototype.hide = function () {
	this.close();
	this.searchId++;
	$("#qpAnswerInputLoadingContainer").addClass("hide");
};

function Suggestion(data) {
	var o = Array.isArray(data)
		? { label: data[0], value: data[1] }
		: typeof data === "object" && "label" in data && "value" in data ? data : { label: data, value: data };

	this.label = o.label || o.value;
	this.value = o.value;
}
Object.defineProperty(Suggestion.prototype = Object.create(String.prototype), "length", {
	get: function () { return this.label.length; }
});
Suggestion.prototype.toString = Suggestion.prototype.valueOf = function () {
	return "" + this.label;
};

AmqAwesomeplete.prototype.goto = function (i) {
	//Handle case where perfectscollbar have added scroll containers
	let childrenCount = this.$ul.children().length;
	if (i >= childrenCount - 2 && this.$ul.children('div').length) {
		if (this.index === 0) {
			i = childrenCount - 3;
		} else {
			i = 0;
		}

	}
	Awesomplete.prototype.goto.call(this, i);
};