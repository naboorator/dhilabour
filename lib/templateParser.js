class TemplateParser {

    /**
     * Parse a template string with nested IFs and FOREACH loops.
     * @param {string} tpl - template content
     * @param {object} context - variables available to the template
     */
    parse(tpl, context = {}) {
        let prev;

        // recursively re-parse until no more changes occur
        do {
            prev = tpl;
            tpl = this._parseForeach(tpl, context);
            tpl = this._parseIf(tpl, context);
            tpl = this._parseVariables(tpl, context);
        } while (tpl !== prev);

        return tpl;
    }


    /** ---------------------------
     *  IF PARSER
     * --------------------------- */
    _parseIf(tpl, ctx) {
        return tpl.replace(
            /@if\s*\((.*?)\)([\s\S]*?)@endIf/g,
            (match, condition, content) => {
                let result = false;

                try {
                    result = Function("with(this) { return " + condition + "; }")
                        .call(ctx);
                } catch (e) {
                    console.error("IF evaluation error:", condition, e);
                    return "";
                }

                if (result) {
                    // parse nested structures inside the IF
                    return this.parse(content, ctx);
                }

                return "";
            }
        );
    }


    /** ---------------------------
     *  FOREACH PARSER
     * --------------------------- */
    _parseForeach(tpl, parentCtx) {

        return tpl.replace(
            /@foreach\s*\(\s*(.*?)\s+as\s+([A-Za-z_$][\w$]*)\s*\)\s*([\s\S]*?)@endForeach/g,
            (match, listExpr, itemName, content) => {

                let list;

                // evaluate the list expression inside the parent context
                try {
                    list = Function("with(this) { return " + listExpr + "; }")
                        .call(parentCtx);
                } catch (e) {
                    console.error("FOREACH evaluate error:", listExpr, e);
                    return "";
                }

                if (!list || typeof list[Symbol.iterator] !== "function") {
                    console.warn("FOREACH target is not iterable:", listExpr);
                    return "";
                }

                let output = "";

                for (const item of list) {
                    // create a new context that inherits from parent
                    const loopCtx = {...parentCtx, [itemName]: item};

                    // recursively parse nested loops and IFs inside the block
                    let block = this.parse(content, loopCtx);

                    // evaluate {{ variables }} inside the loop
                    block = block.replace(/{{\s*(.*?)\s*}}/g, (_, expr) => {
                        try {
                            return Function("with(this) { return " + expr + "; }")
                                .call(loopCtx);
                        } catch (e) {
                            console.error("FOREACH inner expression error:", expr, e);
                            return "";
                        }
                    });

                    output += block;
                }

                return output;
            }
        );
    }


    /** ---------------------------
     *  VARIABLE PARSER
     * --------------------------- */
    _parseVariables(tpl, ctx) {
        return tpl.replace(/{{\s*(.*?)\s*}}/g, (_, expr) => {
            try {
                return Function("with(this) { return (" + expr + "); }")
                    .call(ctx) ?? "";
            } catch (e) {
                // swallow missing variable errors silently
                return "";
            }
        });
    }
}
