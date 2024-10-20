"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Zap, Combine, Play, Code2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function RuleEngine() {
  const [newRule, setNewRule] = useState({ name: '', rule_string: '' })
  const [createdRule, setCreatedRule] = useState('')
  const [rulesToCombine, setRulesToCombine] = useState('')
  const [combinedRule, setCombinedRule] = useState('')
  const [userData, setUserData] = useState('')
  const [evaluationResult, setEvaluationResult] = useState<boolean | null>(null)
  const [error, setError] = useState('')
  const [ruleInput, setRuleInput] = useState('')
  const [resultText, setResultText] = useState('')
  const createRule = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/rules/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRule)
      })
      if (!response.ok) throw new Error('Failed to create rule')
      const result = await response.json()
      setCreatedRule(JSON.stringify(result, null, 2))
      setNewRule({ name: '', rule_string: '' })
      setError('')
      toast.success('Rule created successfully!')
    } catch (err) {
      setError('Failed to create rule. Please try again.')
      toast.error('Failed to create rule. Please try again.')
    }
  }

  const combineRules = async () => {
    try {
      const ruleStrings = rulesToCombine.split('\n').filter(rule => rule.trim() !== '')
      const response = await fetch('http://localhost:5002/api/rules/combine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rule_strings: ruleStrings })
      })
      if (!response.ok) throw new Error('Failed to combine rules')
      const result = await response.json()
      setCombinedRule(JSON.stringify(result, null, 2))
      setError('')
    } catch (err) {
      setError('Failed to combine rules. Please check your input and try again.')
    }
  }

  const evaluateRule = async () => {
    try {
      const inputData = JSON.parse(ruleInput)
      const response = await fetch('http://localhost:5002/api/rules/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputData)
      })
      if (!response.ok) throw new Error('Failed to evaluate rule')
      const result = await response.json()
      console.log('API response:', result.eligible)
      setEvaluationResult(result.eligible)
      setResultText(result.eligible ? "correct" : "wrong")
      setError('')
      toast.success('Rule evaluated successfully!')
    } catch (err) {
      setError('Failed to evaluate rule. Please check your input and try again.')
      toast.error('Failed to evaluate rule. Please check your input and try again.')
      setEvaluationResult(null)
    }
  }

  useEffect(() => {
    try {
      if (combinedRule) {
        JSON.parse(combinedRule);
      }
    } catch (error) {
      setError('Invalid combined rule JSON. Please check and try again.');
    }
  }, [combinedRule]);

  useEffect(() => {
    try {
      if (userData) {
        JSON.parse(userData);
      }
    } catch (error) {
      setError('Invalid user data JSON. Please check and try again.');
    }
  }, [userData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-teal-100 to-green-200 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto space-y-8"
      >
        <Card className="w-full max-w-4xl mx-auto overflow-hidden shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-700 text-white p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CardTitle className="text-4xl font-bold mb-2">Rule Engine</CardTitle>
              <CardDescription className="text-blue-100 text-lg">Create, combine, and evaluate rules with ease</CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="create" className="text-lg">Create</TabsTrigger>
                <TabsTrigger value="combine" className="text-lg">Combine</TabsTrigger>
                <TabsTrigger value="evaluate" className="text-lg">Evaluate</TabsTrigger>
              </TabsList>

              <TabsContent value="create">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <h3 className="text-2xl font-semibold mb-6 flex items-center text-blue-700">
                    <Zap className="mr-2 text-yellow-500" />
                    Create New Rule
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="ruleName" className="text-sm font-medium text-gray-700">Rule Name</Label>
                      <Input
                        id="ruleName"
                        value={newRule.name}
                        onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                        placeholder="Enter rule name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ruleString" className="text-sm font-medium text-gray-700">Rule String</Label>
                      <Input
                        id="ruleString"
                        value={newRule.rule_string}
                        onChange={(e) => setNewRule({ ...newRule, rule_string: e.target.value })}
                        placeholder="e.g., age > 30 AND department = 'HR' or age < 20"
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={createRule} className="w-full bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-lg py-6">
                      Create Rule
                    </Button>
                    {createdRule && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Label htmlFor="createdRule" className="text-sm font-medium text-gray-700">Created Rule (AST JSON)</Label>
                        <Textarea
                          id="createdRule"
                          value={createdRule}
                          readOnly
                          rows={10}
                          placeholder="The created rule AST will appear here"
                          className="mt-1 bg-gray-50 font-mono text-sm"
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="combine">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <h3 className="text-2xl font-semibold mb-6 flex items-center text-teal-700">
                    <Combine className="mr-2 text-teal-500" />
                    Combine Rules
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="rulesToCombine" className="text-sm font-medium text-gray-700">Rules to Combine (one per line)</Label>
                      <Textarea
                        id="rulesToCombine"
                        value={rulesToCombine}
                        onChange={(e) => setRulesToCombine(e.target.value)}
                        placeholder="age > 30&#10;salary < 50000 OR experience > 5"
                        rows={5}
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={combineRules} className="w-full bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 text-lg py-6">
                      Combine Rules
                    </Button>
                    {combinedRule && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Label htmlFor="combinedRule" className="text-sm font-medium text-gray-700">Combined Rule (AST JSON)</Label>
                        <Textarea
                          id="combinedRule"
                          value={combinedRule}
                          readOnly
                          rows={10}
                          placeholder="The combined rule AST will appear here"
                          className="mt-1 bg-gray-50 font-mono text-sm"
                        />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="evaluate">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <h3 className="text-2xl font-semibold mb-6 flex items-center text-green-700">
                    <Play className="mr-2 text-green-500" />
                    Evaluate Rule
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="ruleInput" className="text-sm font-medium text-gray-700">Rule Input (JSON)</Label>
                      <Textarea
                        id="ruleInput"
                        value={ruleInput}
                        onChange={(e) => setRuleInput(e.target.value)}
                        placeholder='{"ast": {...}, "userData": {...}}'
                        rows={10}
                        className="mt-1 font-mono text-sm"
                      />
                    </div>
                    <Button
                      onClick={evaluateRule}
                      disabled={!ruleInput}
                      className="w-full bg-gradient-to-r from-green-700 to-blue-800 hover:from-green-800 hover:to-blue-900 text-white text-lg py-6"
                    >
                      Evaluate Rule
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>

            {/* Evaluation Result Section */}
            <AnimatePresence>
              {evaluationResult !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`p-6 rounded-lg shadow-md ${evaluationResult === true ? 'bg-teal-100' : 'bg-red-100'}`}
                >
                  <div className="flex items-center space-x-2">
                    {evaluationResult === true ? (
                      <CheckCircle2 className="h-8 w-8 text-teal-600" />
                    ) : (
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    )}
                    <span className="text-2xl font-semibold">
                      Rule Evaluation Result: {resultText}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
      <ToastContainer />
    </div>
  )
}
